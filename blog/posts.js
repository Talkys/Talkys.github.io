document.addEventListener("DOMContentLoaded", () => {
            const endpoint = "/blog/posts.json";

            // Fallback sample data in case /posts.json is missing during local development
            const fallbackPosts = [];

            fetch(endpoint)
                .then(res => {
                    if (!res.ok) throw new Error("Could not load posts JSON");
                    return res.json();
                })
                .then(data => renderTree(data))
                .catch(err => {
                    console.warn("Using fallback post data:", err);
                    renderTree(fallbackPosts);
                });

            function renderTree(posts) {
                const container = document.getElementById("posts-tree");
                const countBadge = document.getElementById("post-count");

                if (!posts || posts.length === 0) {
                    container.innerHTML = '<p class="text-zinc-600">No posts found.</p>';
                    return;
                }

                countBadge.textContent = `${posts.length} posts`;

                // Group posts by Year -> Month
                const tree = {};

                posts.forEach(post => {
                    const d = new Date(post.date);
                    const year = d.getFullYear();
                    const month = d.toLocaleString('en-US', { month: 'long' });

                    if (!tree[year]) tree[year] = {};
                    if (!tree[year][month]) tree[year][month] = [];

                    tree[year][month].push(post);
                });

                // Sort years descending
                const sortedYears = Object.keys(tree).sort((a, b) => b - a);

                let html = '';

                sortedYears.forEach(year => {
                    html += `
                        <details class="group/year" open>
                            <summary class="cursor-pointer select-none font-semibold text-zinc-300 hover:text-zinc-100 flex items-center gap-1 py-1">
                                <svg class="w-3 h-3 transition-transform group-open/year:rotate-90 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7"></path>
                                </svg>
                                ${year}
                            </summary>
                            <div class="pl-3 border-l border-zinc-800 ml-1.5 space-y-2 mt-1">
                    `;

                    Object.keys(tree[year]).forEach(month => {
                        html += `
                            <details class="group/month" open>
                                <summary class="cursor-pointer select-none font-medium text-zinc-100 hover:text-zinc-200 flex items-center gap-1 py-0.5">
                                    <svg class="w-2.5 h-2.5 transition-transform group-open/month:rotate-90 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="9 5l7 7-7 7"></path>
                                    </svg>
                                    ${month}
                                </summary>
                                <ul class="pl-3 border-l border-zinc-800/60 ml-1 mt-1 space-y-1">
                        `;

                        tree[year][month].forEach(p => {
                            const isCurrent = window.location.pathname === p.url;
                            const activeClass = isCurrent ? "text-zinc-100 font-medium" : "text-zinc-400 hover:text-zinc-200";

                            html += `
                                <li>
                                    <a href="${p.url}" 
                                       title="${p.title}" 
                                       class="block truncate pl-2 py-0.5 transition-colors ${activeClass}">
                                        ${p.title}
                                    </a>
                                </li>
                            `;
                        });

                        html += `
                                </ul>
                            </details>
                        `;
                    });

                    html += `
                            </div>
                        </details>
                    `;
                });

                container.innerHTML = html;
            }
        });