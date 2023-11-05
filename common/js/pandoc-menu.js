document.addEventListener('DOMContentLoaded', function () {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const nav = document.createElement('nav');
    document.querySelector('.pandoc').insertBefore(nav, document.querySelector('.pandoc').firstChild);
    const topLevelList = document.createElement('ul');
    nav.appendChild(topLevelList);

    let currentLevel = topLevelList;
    let lastLevel = 1;

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

    // document.body.insertBefore(nav, document.body.firstChild);

    // Add functionality for expanding/collapsing
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