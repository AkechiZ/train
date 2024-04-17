(function () {
  const url = new URL(window.location.href);
  const newsId = url.searchParams.get('id');

  if (!newsId) {
    return;
  }

  newsService.getNewsById(newsId).then((news) => {
    console.log(news);
    createArticle(news);
  });

  function createArticle(news) {
    const $article = document.querySelector('article');

    $article.append(createBanner());

    const $section = document.createElement('section');
    $section.className = 'p-4';

    $section.append(createTitle(news.title));
    $section.append(createSource(news.id, news.createdAt));
    $section.append(createBody(news.summary));

    $article.append($section);

    return $article;
  }

  function createBanner() {
    return createImage('banner');
  }

  function createIllustration() {
    return createImage('illustration');
  }

  function createImage(type) {
    const $img = createLazyloadImage(
      `https://loremflickr.com/320/240/dog?lock=${newsId}`,
      `https://loremflickr.com/320/240/dog?lock=${newsId}-${type}`,
      '新闻插图',
      `https://loremflickr.com/320/240/dog?lock=${newsId}-${type} 800w, https://loremflickr.com/320/240/dog?lock=${newsId}-${type} 1200w`,
      '20vh',
        "1560px",
        "560px",
    );

    return $img;
  }

  function createTitle(title) {
    const $title = document.createElement('h3');
    $title.className =
      'px-4 text-base sm:text-3xl text-center text-black font-bold';
    $title.textContent = title;

    return $title;
  }

  function createSource(source, date) {
    const $source = document.createElement('div');
    $source.className = 'my-4 text-xs sm:text-base text-[#b1b1b1] text-center';
    $source.textContent = `${new Date(
      date,
    ).toLocaleDateString()}　来源：${source}`;

    return $source;
  }

  function createBody(content1) {
    const $p = document.createElement('p');
    $p.textContent = content1;

    return $p;
  }
})();
