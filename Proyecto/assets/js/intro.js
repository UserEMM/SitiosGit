document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('introCalled')) {
    setTimeout(function(){
        introJs().setOptions({
        steps: [{
            title: 'Welcome',
            intro: 'Welcome to Resonancia, this is an introduction to our system'
        },
        {
            element: document.querySelector('.header__nav__links__item.aboutUs a'),
            intro: 'This is the About Us link, to know who we are!',
            position: 'bottom'
        },
        {
            element: document.querySelector('.header__nav__links__item[contactUs] a'),
            intro: 'This is the Contact link, to see all our contacts and our atention time',
            position: 'bottom'
        },
        {
            element: document.querySelector('.categories__title'),
            intro: 'This is the Popular Categories section, where we sell our instruments',
            position: 'top'
        },
        {
            element: document.querySelector('.our_mission_title'),
            intro: 'This is the Services section, where you can ask for our services',
            position: 'top'
        }

    ]
    }).start();

    localStorage.setItem('introCalled', true);
    },100);
    }
});
