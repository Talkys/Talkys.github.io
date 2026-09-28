/**
 * /blog/article-renderer.js
 */

function parseFrontmatter(rawContent) {
    const match = rawContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!match) return { meta: {}, body: rawContent };

    const meta = (window.jsyaml ? window.jsyaml.load(match[1]) : {}) || {};
    const body = rawContent.slice(match[0].length);
    return { meta, body };
}

function formatDate(dateVal) {
    if (!dateVal) return { iso: "", display: "" };
    
    // Support YYYY-MM-DD strings safely without timezone shifts
    const parts = String(dateVal).split("-");
    let dt;
    if (parts.length === 3) {
        dt = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
        dt = new Date(dateVal);
    }

    if (isNaN(dt.getTime())) return { iso: String(dateVal), display: String(dateVal) };

    const iso = dt.toISOString().split("T")[0];
    const display = dt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    return { iso, display };
}

function applyTailwindClasses(container) {
    // 1. Headings
    container.querySelectorAll("h2").forEach(h2 => {
        h2.className = "text-2xl font-semibold text-zinc-100 mt-12 mb-4 tracking-tight border-b border-zinc-800/60 pb-2";
    });
    container.querySelectorAll("h3").forEach(h3 => {
        h3.className = "text-lg font-medium text-zinc-100 mt-8 mb-2";
    });
    container.querySelectorAll("h4").forEach(h4 => {
        h4.className = "text-base font-medium text-zinc-200 mt-6 mb-2";
    });

    // 2. Lists
    container.querySelectorAll("ul").forEach(ul => {
        ul.className = "list-disc list-outside ml-5 space-y-2 text-zinc-400 marker:text-zinc-600";
    });
    container.querySelectorAll("ol").forEach(ol => {
        ol.className = "list-decimal list-outside ml-5 space-y-3 text-zinc-400 marker:text-zinc-600";
    });

    // 3. Inline emphasis
    container.querySelectorAll("strong, b").forEach(el => {
        el.className = "font-medium text-zinc-200";
    });

    // 4. Links
    container.querySelectorAll("a").forEach(a => {
        a.className = "font-medium text-zinc-100 underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300 transition-all";
        if (a.getAttribute("href")?.startsWith("http")) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        }
    });

    // 5. Inline Code and Code Blocks
    container.querySelectorAll("pre").forEach(pre => {
        pre.className = "bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 font-mono text-sm overflow-x-auto text-zinc-200 my-6";
    });
    container.querySelectorAll("code").forEach(code => {
        if (code.parentElement.tagName !== "PRE") {
            code.className = "font-mono text-sm text-zinc-200 bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-0.5 rounded-md";
        }
    });

    // 6. Blockquotes -> styled div
    container.querySelectorAll("blockquote").forEach(bq => {
        const div = document.createElement("div");
        div.className = "ml-2 space-y-2 border-l-2 border-zinc-700 pl-4 py-1 my-4 bg-zinc-900/30 rounded-r-lg";
        div.innerHTML = bq.innerHTML;
        bq.replaceWith(div);
    });

    // 7. Images: wrap in <figure>
    container.querySelectorAll("img").forEach(img => {
        img.className = "w-full rounded-lg border border-zinc-800/60 bg-zinc-900 shadow-md";
        const parent = img.parentElement;
        const figure = document.createElement("figure");
        figure.className = "my-6";

        if (parent && parent.tagName === "P" && parent.childNodes.length === 1) {
            parent.replaceWith(figure);
            figure.appendChild(img);
        } else {
            img.replaceWith(figure);
            figure.appendChild(img);
        }
    });
}

function buildGithubCard(url, title, desc) {
    if (!url) return null;
    const cardTitle = title || "Interested in the code?";
    const cardDesc = desc || "The full source code for this project is available on GitHub.";

    const card = document.createElement("div");
    card.className = "mt-10 p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";
    card.innerHTML = `
        <div class="space-y-1">
            <h4 class="text-zinc-200 font-medium">${cardTitle}</h4>
            <p class="text-sm text-zinc-400">${cardDesc}</p>
        </div>
        <a class="inline-flex items-center gap-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-300 transition-colors px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" 
           href="${url}" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
        </a>
    `;
    return card;
}

/**
 * Main export function
 * @param {string} markdownUrl Path to the markdown file
 */
async function loadAndRenderPost(markdownUrl) {
    try {
        const response = await fetch(markdownUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawContent = await response.text();

        const { meta, body } = parseFrontmatter(rawContent);

        // Update page title and metadata
        if (meta.title) {
            document.title = `${meta.title} — Tallys Assis`;
            const titleEl = document.getElementById("post-title");
            if (titleEl) titleEl.textContent = meta.title;
        }

        const categoryEl = document.getElementById("post-category");
        if (categoryEl) categoryEl.textContent = meta.category || "General";

        const { iso, display } = formatDate(meta.date);
        const dateEl = document.getElementById("post-date");
        if (dateEl) {
            dateEl.setAttribute("datetime", iso);
            dateEl.textContent = display;
        }

        const backLinkEl = document.getElementById("post-backlink");
        if (backLinkEl) backLinkEl.setAttribute("href", "/blog/home.html");

        // Render Markdown body
        const bodyContainer = document.getElementById("post-body");
        if (bodyContainer) {
            bodyContainer.innerHTML = window.marked.parse(body);
            applyTailwindClasses(bodyContainer);

            // Optional GitHub block
            const githubCard = buildGithubCard(meta.github_url, meta.github_title, meta.github_desc);
            if (githubCard) bodyContainer.appendChild(githubCard);
        }
    } catch (err) {
        console.error("Failed to render markdown article:", err);
        const bodyContainer = document.getElementById("post-body");
        if (bodyContainer) {
            bodyContainer.innerHTML = `<p class="text-red-400">Failed to load content.</p>`;
        }
    }
}

// Expose globally
window.loadAndRenderPost = loadAndRenderPost;