/**
 * Универсальный слайдер для сайта. Умеет автоматически воспроизводить слайды.
 * Независим от количсества картинок.
 * Важно установить класс "slider-item" на картинки и создать основной блок с id = "slider"
 *
 * @class
 */
class Slider {
    // Селектор для элемента слайдера
    static #SLIDER_ITEM_SELECTOR = '.slider-item';
    // Селектор активного слайда
    static #SLIDER_ACTIVE_ITEM_SELECTOR = '.slider-item-action';
    // Интервал автоматического переключения
    static #SLIDE_AUTOPLAY_INTERVAL = 2000;
    // Селектор кнопки "Предыдущий"
    static #SLIDER_BTN_PREV = '#slider-btn-prev';
    // Селектор кнопки "Следующий"
    static #SLIDER_BTN_NEXT = '#slider-btn-next';
    // Селектор строки состояний
    static #BAR_SELECTOR = '#bar';
    // Название класса активной точки в строке состояний
    static #BAR_ACTIVE_ITEM_CLASS_NAME = 'bar-item-active';
    // Название класса элемента строки состояний
    static #BAR_ITEM_CLASS_NAME = 'bar-item';



    // Текущий номер слайда
    #currentSlide = 0;
    // Общее количество слайдов
    #slideCount = 0;
    // Идентификатор интервала автоматического воспроизведения
    #intervalID = null;

    constructor() {
        // Вычисление общего количества слайдов
        this.#slideCount = $(Slider.#SLIDER_ITEM_SELECTOR).length;

        this._createBar();
        this._subscribeEvents();
        this._loadImage();
    }

    /**
     * Автовоспроизведение слайдов
     */
    autoplay() {
        this.#intervalID = setInterval(this.next.bind(this), Slider.#SLIDE_AUTOPLAY_INTERVAL);
    }

    /**
     * Остановить автовоспроизведение
     */
    stopAutoplay() {
        clearInterval(this.#intervalID);
    }

    /**
     * Переключение на селдующий слайд
     *
     * @param stopAutoplay остановить автоматичсекое воспроизведение
     */
    next(stopAutoplay = false) {
        this.#currentSlide++;

        // Если мы перевалили за общее количество сладов - начинаем с первого
        if (this.#currentSlide > this.#slideCount - 1) {
            this.#currentSlide = 0;
        }

        this._processSlide(stopAutoplay);
    }

    /**
     * Переключение на предыдущий слайд
     *
     * @param stopAutoplay остановить автоматичсекое воспроизведение
     */
    prev(stopAutoplay = false) {
        this.#currentSlide--;

        if (this.#currentSlide < 0) {
            this.#currentSlide = this.#slideCount - 1;
        }

        this._processSlide(stopAutoplay);
    }

    /**
     * Ленивая загрузка изображений
     *
     * @private
     */
    _loadImage() {
        const selector = $($(Slider.#SLIDER_ITEM_SELECTOR)[this.#currentSlide]);

        if (!selector.attr('src')) {
            selector.attr('src', selector.data().src);
        }
    }

    /**
     * Процесс переключения слайдов
     *
     * @param stopAutoplay остановить автоматичсекое воспроизведение
     * @private
     */
    _processSlide(stopAutoplay) {
        this._loadImage();

        if (stopAutoplay) {
            this.stopAutoplay();
        }

        // Учитывая, что селектор у нас с ".", ее нужно удалить
        const activeClassName = Slider.#SLIDER_ACTIVE_ITEM_SELECTOR.replace('.', '');
        // Убираем активный класс у текущегор слайда
        $(Slider.#SLIDER_ACTIVE_ITEM_SELECTOR).removeClass(activeClassName);
        // Добавляем активный класс у следующего слайда
        $($(Slider.#SLIDER_ITEM_SELECTOR)[this.#currentSlide]).addClass(activeClassName);

        this._setActiveBarItem();
    }

    /**
     * Подписка на обработку событий нашего слайдера
     *
     * @private
     */
    _subscribeEvents() {
        $(Slider.#SLIDER_BTN_PREV).click(() => {
            this.prev(true);
        });

        $(Slider.#SLIDER_BTN_NEXT).click(() => {
            this.next(true);
        });

        $(`.${Slider.#BAR_ITEM_CLASS_NAME}`).click((event) => {
            this._jumpToSlide(event.target);
        });
    }

    /**
     * Переход к конкретному слайду
     *
     * @param element элемент клика
     * @private
     */
    _jumpToSlide(element) {
        // Все data-фттрибуты при переводе в JS перобразуют имя в camelCase, т.е data-slide-number = slideNumber
        this.#currentSlide = $(element).data().slideNumber;
        this._processSlide(true);
    }

    /**
     * Создание строки сосотояний (добавление точек)
     *
     * @private
     */
    _createBar() {
        for (let i = 0; i < this.#slideCount; i++) {
            $(Slider.#BAR_SELECTOR).append(`<i class="fa-solid fa-circle ${Slider.#BAR_ITEM_CLASS_NAME}" data-slide-number="${i}"></i>`);
        }

        this._setActiveBarItem();
    }

    /**
     * Установка текущего положения в строке состояний
     *
     * @private
     */
    _setActiveBarItem() {
        $(`.${Slider.#BAR_ACTIVE_ITEM_CLASS_NAME}`).removeClass(Slider.#BAR_ACTIVE_ITEM_CLASS_NAME);
        $($(`.${Slider.#BAR_ITEM_CLASS_NAME}`)[this.#currentSlide]).addClass(Slider.#BAR_ACTIVE_ITEM_CLASS_NAME);

    }
}

$(() => {
    const slider = new Slider();
    slider.autoplay();
});
