const projects = [
    {
        platform: 'general',
        image: '/img/creeps_bkg.png',
        title: 'Creeps',
        description: 'My first complete project. Just a flatpak test for the godot 2d trutorial.',
        link: 'https://github.com/Talkys/Creeps'
    },
    {
        platform: 'general',
        image: '/img/autodungeon_bkg.png',
        title: 'Auto Dungeon',
        description: 'A random dungeon generator made in go and python',
        link: 'https://github.com/Talkys/Auto-Dungeon'
    },
    {
        platform: 'general',
        image: '/img/zuimOS_bkg.png',
        title: 'ZuimOS',
        description: 'A simple operating system made as a graduation project',
        link: 'https://github.com/Talkys/ZuimOS'
    },
    {
        platform: 'linuxexclusive',
        image: '/img/amogOS_bkg.png',
        title: 'AmogOS',
        description: 'My first operating system',
        link: 'https://github.com/Talkys/AmogOS'
    },
    {
        platform: 'linuxexclusive',
        image: '/img/alton_bkg.png',
        title: 'Alton\'s Journey',
        description: 'Simple mobile game made as a graduation project',
        link: 'https://github.com/Talkys/Alton-s-Journey'
    },
    {
        platform: 'linuxexclusive',
        image: '/img/BrailleArtify.png',
        title: 'BrailleArtify',
        description: 'Image to text generator made in golang',
        link: 'https://github.com/Talkys/BrailleArtify'
    },
    {
        platform: 'linuxexclusive',
        image: '/img/quantum_bkg.png',
        title: 'Quantum Console',
        description: 'Educational quantum circuit simulator',
        link: 'https://github.com/Talkys/Quantum-Console'
    }
    /*
    {
        platform: 'linuxexclusive',
        image: '/img/talkos_bkg.png',
        title: 'TalkOS',
        description: 'Pure assembly OS made as a personal project',
        link: '#'
    }
    /**/
]

function generateProjectBlock(project, index) {
    return `
        <div role="listitem" class="wrapper w-dyn-item ${project.platform}" style="display: none;">
            <div style="background-image:url(&quot;${project.image}&quot;)"
                class="column background-image">
                <div class="column _100vh">
                    <div class="project-info">
                        <div class="number">
                            <h2 class="number zero">${index}</h2>
                        </div>
                        <h2 class="project-title">${project.title}</h2>
                        <p class="project-description">${project.description}</p>
                        <a href="${project.link}" class="project-link">view project</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

const projectList = document.getElementById("list-projects");
let index = 0;
while (index < projects.length) {
    projectList.innerHTML += generateProjectBlock(projects[index], index+1)
    index++;
}