document.addEventListener('DOMContentLoaded', function () {
    const menudiv = document.createElement('div');
    menudiv.className = 'side-menu';
    
    const menutitle = document.createElement('div');
    menutitle.textContent = document.title;
    menudiv.appendChild(menutitle);

    // a button to open/close nav list
    const toggleNavButton = document.createElement('button');
    toggleNavButton.id = 'toggle-nav';
    toggleNavButton.textContent = '关闭';
    menudiv.appendChild(toggleNavButton);

    // Add click event listener to the button
    toggleNavButton.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
        toggleNavButton.textContent = toggleNavButton.textContent === '关闭' ? '打开' : '关闭';
    });

    // nav list itself
    const nav = document.createElement('nav');
    menudiv.appendChild(nav);
    document.querySelector('.pandoc').insertBefore(menudiv, document.querySelector('.pandoc').firstChild);
    const topLevelList = document.createElement('ul');
    nav.appendChild(topLevelList);

    let currentLevel = topLevelList;
    let lastLevel = 1;

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = heading.textContent;
        anchor.href = `#${heading.textContent.replace(/\s+/g, '-').toLowerCase()}`;
        listItem.appendChild(anchor);

        const level = parseInt(heading.tagName.charAt(1));

        if (level > lastLevel) {
            const newUl = document.createElement('ul');
            currentLevel.lastElementChild.appendChild(newUl);
            currentLevel = newUl;
        } else if (level < lastLevel) {
            for (let i = level; i < lastLevel; i++) {
                currentLevel = currentLevel.parentElement.parentElement;
            }
        }

        currentLevel.appendChild(listItem);
        lastLevel = level;
    });

    // Add functionality for expanding/collapsing menu list
    const navLinks = document.querySelectorAll('nav ul li');
    navLinks.forEach(link => {
        const sublist = link.querySelector('ul');
        if (sublist) {
            link.classList.add('toggle');
            sublist.style.display = 'none';

            link.addEventListener('click', (e) => {
                if (e.target === link || e.target === link.firstChild) {
                    sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
                    link.classList.toggle('expanded');
                }
            });
        }
    });
});
