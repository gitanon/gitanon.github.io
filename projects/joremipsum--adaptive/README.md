# Joremipsum fixed

## Used tools

* Editor - [Atom](https://atom.io/)
* Build system - [Gulp](http://gulpjs.com/)
* CSS preprocessor - [Stylus](http://stylus-lang.com/)
* HTML preprocessor - [Jade](http://jade-lang.com/)

## Issues

* В секции row1 большие иконки для мобильного разрешения, из-за спрайта не возможно с помощью CSS менять размер. Решение: под разные разрешения, разные иконки в спрайте или SVG-иконки.
* В секции row1 кнопка .row1__btn в firefox прижалась влево, в chromium-браузерах левая кнопка прижалась влево, права кнопка стоит нормально. Не понимаю почему так
* В секции row2 при мобильном разрешении .row2__icon прилип к .row2__title, наследует все поля и отступы, не знаю, как позиционировать .row2__icon, решил убрать из мобильного разрешения.
