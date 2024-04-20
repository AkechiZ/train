(function () {
  const url = new URL(window.location.href);
  let TOTAL = 100;
  let pagination = 10;
  let page = url.searchParams.get('page') || '1';
  let limit = url.searchParams.get('limit') || '8';

  /** @type {HTMLSelectElement} */
  const $paginationSizer = document.querySelector('.pagination-sizer');
  $paginationSizer.querySelectorAll('option').forEach((item) => {
    item.selected = false;

    if (item.value === limit) {
      item.selected = true;
    }
  });

  $paginationSizer.addEventListener('change', (e) => {
    const url = new URL(window.location.href);
    url.searchParams.set('limit', e.target.value);
    window.location.href = url.toString();
  });

  /** @type {HTMLInputElement} */
  const $paginationInput = document.querySelector('.pagination-jumper-input');

  $paginationInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (e.target.value === '') {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('page', e.target.value);
    window.location.href = url.toString();
  });

  const $newsList = document.querySelector('#news-page');

  newsService.getNews(page, limit).then((newsList) => {
    $newsList.innerHTML = '';
    newsList.forEach((news, i) => {
      const $newItem = createNewsItem(
        `https://loremflickr.com/320/240/dog?lock=${page * limit + i}`,
        `https://loremflickr.com/320/240/dog?lock=${page * limit + i}`,
        news.title,
        news.summary.substring(0,100),
        news.id,
      );
      // TOTAL = newsList.links.total
      // pagination = newsList.links.pagination
      generatePagination(TOTAL, +page, +limit);
      $newsList.append($newItem);
    });
  });

  function generatePagination(total, page, limit) {
    /** @type {HTMLUListElement} */
    const $paginationList = document.querySelector('.pagination-item-list');
    $paginationList.innerHTML = '';

    /**
     * 开始页码
     */
    const startPage = 1;
    /**
     * 结束页码
     */
    const endPage = Math.ceil(total / limit);

    const $prev = createPaginationItem('<');
    $prev.classList.add('pagination-prev');

    if (page === 1) {
      $prev.classList.add('pagination-item-disabled');
    } else {
      setLink($prev, page - 1);
    }

    $paginationList.append($prev);

    const $startItem = createPaginationItem('1');
    setLink($startItem, 1);
    setActive($startItem, 1, page);
    $paginationList.append($startItem);

    const TOTAL_MIDDLE_NUMBERS = 5;

    const $prevJumper = createPaginationItem('...');
    setLink(
      $prevJumper,
      clamp(startPage, page - TOTAL_MIDDLE_NUMBERS, endPage),
    );
    const $nextJumper = createPaginationItem('...');
    setLink(
      $nextJumper,
      clamp(startPage, page + TOTAL_MIDDLE_NUMBERS, endPage),
    );

    const middlePageStart = clamp(
      startPage + 1,
      page - Math.floor(TOTAL_MIDDLE_NUMBERS / 2),
      endPage - 1,
    );

    for (let i = 0; i < TOTAL_MIDDLE_NUMBERS; i++) {
      const current = clamp(startPage, middlePageStart + i, endPage);

      if ([startPage, endPage].includes(current)) {
        continue;
      }

      const $item = createPaginationItem(current);
      setLink($item, current);

      if (i === 0 && current !== startPage + 1) {
        $paginationList.append($prevJumper);
      }

      $paginationList.append($item);
      setActive($item, current, page);

      if (i === TOTAL_MIDDLE_NUMBERS - 1 && current !== endPage - 1) {
        $paginationList.append($nextJumper);
      }
    }

    if (startPage !== endPage) {
      const $endItem = createPaginationItem(String(endPage));
      setLink($endItem, endPage);
      setActive($endItem, endPage, page);
      $paginationList.append($endItem);
    }

    const $next = createPaginationItem('>');
    $next.classList.add('pagination-next');

    if (page === endPage) {
      $next.classList.add('pagination-item-disabled');
    } else {
      setLink($next, page + 1);
    }

    $paginationList.append($next);
  }

  /**
   * @param {HTMLLIElement} el
   * @param {number} page
   */
  function setLink(el, page, limit) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);

    const $a = document.createElement('a');
    $a.href = url.toString();

    el.append($a);
  }

  function createPaginationItem(content) {
    const $item = document.createElement('li');
    $item.textContent = content;
    $item.classList.add('pagination-item');

    return $item;
  }

  function clamp(min, value, max) {
    return Math.min(Math.max(min, value), max);
  }

  /**
   * @param {HTMLElement} el
   * @param {number} current
   * @param {number} page
   */
  function setActive(el, current, page) {
    if (current !== page) {
      return;
    }

    el.classList.add('pagination-item-active');
  }
})();
