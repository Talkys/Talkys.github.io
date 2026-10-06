---
title: Building TracerouteUI - From Frozen Maps to Real-Time Packet Tracing
date: 2026-09-28
category: Web development
back_link: /blog/home.html
github_url: https://github.com/Talkys/TracerouteUI
github_title: Interested in the code?
github_desc: The full source code is available on GitHub.
---


Every network engineer or sysadmin is familiar with `traceroute`. It’s simple, dependable, and gives you raw CLI output fast. But standard CLI tools don't visually show *where* in the world your packets are actually traveling.

I set out to build a visual tracerouting tool specifically tailored for Linux users-one that required zero root/`sudo` privileges and provided an interactive map. Getting there, however, required rethinking my entire approach-moving away from a monolithic desktop app toward a modular, web-based, real-time architecture.

Here is the story of how **TracerouteUI** evolved from a frozen PyQt map generator into a responsive, real-time visualization tool.

---

## Phase 1: The Monolith and the Frozen Screen

The project started as a Python desktop app built with **PyQt**, using **Cartopy** and **Matplotlib** to plot network routes over a world map image.

Under the hood, this first iteration simply spawned the system `traceroute` command, waited for it to complete the full path, parsed the IP addresses, and plotted the final nodes onto a static canvas.

```
[PyQt App] ──> Execs `traceroute` ──> Waits for full completion ──> Generates Matplotlib Map

```

While it worked, the user experience left a lot to be desired:

1. **The Frozen UI Problem:** Because it relied on the default `traceroute` utility as a single blocking execution, the app would essentially sit on a frozen screen for 10–30 seconds waiting for every hop and timeout to finish before rendering anything.
2. **Restricted Map Styling:** Styling a world map through Cartopy and Matplotlib required heavy workarounds to look halfway decent, and offered virtually no interactive feedback while running.

A visual traceroute tool loses its purpose if you can't actually *watch* the route form live. I archived the project for a bit, but eventually came back to solve the core issue: **real-time hop rendering**.

---

## Phase 2: Bypassing `sudo` and Re-architecting for Streaming

To show hops in real time as they respond, I had to stop treating the trace as one long command and start probing individual hops on demand.

### Decision 1: Overcoming the `sudo` Barrier with `ping`

In Linux, sending raw ICMP packets directly via sockets requires `CAP_NET_RAW` or `sudo`. Unprivileged UDP sockets (`SOCK_DGRAM`) are often blocked or silently dropped by intermediate routers and firewalls along the path.

To keep the tool lightweight and accessible without asking for elevated privileges, I used a native binary trick: **calling system `ping` with custom Time-To-Live (TTL) values**.

Because `ping` is configured on most Linux distros with setuid/capabilities to allow raw ICMP without elevated user rights, executing single-hop probes via `ping -t <ttl>` allowed the app to step down the path one hop at a time-strictly as a standard user.

```
Hop 1: ping -t 1 target.com  ──>  Returns Gateway / Intermediate Router
Hop 2: ping -t 2 target.com  ──>  Returns Next Hop Router
...

```

### Decision 2: Decoupling via FastAPI & Web UI

Running single-hop probes meant the backend could stream updates as each hop resolved, rather than blocking on the whole path.

I replaced the PyQt desktop UI with a **FastAPI backend** paired with a **web frontend**:

* The frontend initiates the request and listens for updates.
* The FastAPI backend fires off individual TTL probes sequentially.
* As each hop returns an IP, the backend resolves its geolocation and immediately emits the hop back to the UI to update the map live.

---

## Phase 3: Local Leaflet Maps and Responsible GeoIP

With a real-time stream of hops reaching the browser, I replaced Matplotlib with **Leaflet.js**.

```
[FastAPI Backend] ──> Individual TTL Probe ──> IP-API Geo Lookup ──> Push Hop to Leaflet Canvas

```

### Self-Contained Map Assets

To avoid depending on external, rate-limited, or tile-restricted cloud map APIs, I bundled the map assets locally. While it doesn't give deep, street-level detail, country- and region-level tile data is more than enough for global network packet paths.

### Geolocation & Caching

For resolving IP addresses to geographic coordinates, I integrated the `ip-api.com` service. To avoid abusing an open API across repeated traces:

* **Local Caching:** IPs and locations are cached persistently. Re-visited intermediate hops pull straight from the file.
* **Edge Case Handling:** Private IPs (`10.x.x.x`, `192.168.x.x`) and unresolvable nodes are gracefully skipped, with the trace defaulting to the user's public IP as the starting node.

---

## Retrospective: Lessons Learned

Building TracerouteUI reinforced a valuable lesson about project scope and tool design: **it's perfectly fine to start with the simplest solution first**.

The original PyQt script wasn't a waste-it proved the concept and highlighted the exact friction points (blocking execution, rigid map tools) that informed the redesign. At the end of the day, a visual traceroute tool is meant to be a fun, visual way to explore the web's physical backbone. For deep troubleshooting, the standard CLI `traceroute` is still king. Realizing that kept me from over-engineering unnecessary details and allowed me to focus on making a clean, responsive app.

![Circuit](/blog/assets/img/traceroute.png)

---

### Stack Overview

* **Backend:** Python 3, FastAPI
* **Probing Mechanism:** Native Linux `ping` (TTL manipulation)
* **Frontend:** Leaflet.js, HTML5/JS
* **GeoIP:** `ip-api` with persistent local caching
* **Repository:** [GitHub - Talkys/TracerouteUI](https://github.com/Talkys/TracerouteUI)