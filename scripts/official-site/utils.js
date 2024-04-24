let newsService;

const animationObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.intersectionRatio === 0) {
        return;
      }

      const { animation } = entry.target.dataset;

      if (!animation) {
        return;
      }
      entry.target.classList.remove('invisible');
      entry.target.classList.add(animation);
      animationObserver.unobserve(entry.target);
    }
  },
  {
    threshold: 0.25,
  },
);

const lazyloadObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.intersectionRatio === 0) { //不在视口内
        return;
      }
      setImageAttr(entry.target);
      lazyloadObserver.unobserve(entry.target); //进入视口了，取消观察
    }
  },
  {
    threshold: 0,
    rootMargin: '0px 0px 100px 0px',
  },
);

//创建一个懒加载的图片
function createLazyloadImage(image, placeholderImage, alt, srcset, sizes,width,height) {
  const $img = document.createElement('img');
  $img.setAttribute('data-lazy', image); //需要时才加载
  if (srcset) {
    $img.setAttribute('data-srcset', srcset);
  }

  if (sizes) {
    $img.setAttribute('sizes', sizes);
  }

  $img.setAttribute('data-placeholder', placeholderImage); //占位图
  $img.setAttribute('alt', alt);

  if(width){
    $img.style.width = width;
  }
  if(height){
    $img.style.height = height;
  }

  const $imgWrapper = document.createElement('div'); // 使用 <figure> 作为包装元素
  $imgWrapper.classList.add('image-loading', 'image');
  $imgWrapper.append($img);

  $img.onload = () => { //加载完成，去除毛玻璃特效
    $imgWrapper.classList.remove('image-loading');
  };

  return $imgWrapper;
}

/**
 * @param {string} image 新闻图片
 * @param {string} title 新闻标题
 * @param {string} summary 新闻概览
 */
function createNewsItem(image, placeholderImage, title, summary, id) {
  const $imgWrapper = createLazyloadImage(image, placeholderImage, '新闻插图');
  $imgWrapper.classList.add('news-image', 'hover-scale');

  const $title = document.createElement('h3');
  $title.classList.add('news-title', 'sm:text-lg');
  $title.setAttribute('data-animation', 'fadein');
  $title.textContent = title;

  const $summary = document.createElement('p');
  $summary.classList.add('news-summary');
  $summary.setAttribute('data-animation', 'fadein');
  $summary.textContent = summary;

  const $a = document.createElement('a');
  $a.href = `./news-detail.html?id=${id}`;

  const $newsItem = document.createElement('li');
  $newsItem.classList.add('news-item','max-w-md','md:max-w-full');
  // $newsItem.classList.add('news-item','w-full','md:w-1/2','lg:w-full');
  $newsItem.append($imgWrapper, $title, $summary, $a);

  return $newsItem;
}

/**
 * @param {NodeListOf<Element>} items
 */
function observeAnimationItems(items) {
  if (items.length === 0) {
    return;
  }

  for (const item of items) {
    item.classList.add('invisible');
    animationObserver.observe(item);
  }
}

/**
 * @param {HTMLElement[]} items
 */
function observeLazyloadItems(list) {
  if (!list.length){
    return;
  }

  for (const item of list) {
    const bouding = item.getBoundingClientRect(); //获取位置信息

    //在视觉窗口内，马上展示图片
    if (bouding.top < window.innerHeight) {
      setImageAttr(item);
      continue;
    }

    lazyloadObserver.observe(item); //观察元素是否在窗口内
  }
}

(function () {
  const baseUrl = 'https://661e41be98427bbbef03f6b3.mockapi.io/api/news';
  // const baseUrl = 'http://localhost:3000/news';

  class NewsService {
    newsUrl = new URL('news', baseUrl);

    getNews(page, limit) {
      const search = new URLSearchParams([
        ['page', String(page)],
        ['limit', String(limit)],
      ]);
      const url = new URL(this.newsUrl);
      url.search = search.toString();

      return fetch(url).then((res) => res.json());
    }

    getRecentNews(num) {
      return this.getNews(1, num);
    }

    getNewsById(id) {
      const url = new URL(this.newsUrl.toString() + '/' + id);

      return fetch(url).then((res) => res.json());
    }
  }

  newsService = new NewsService();
})();

(function () {
  // 创建 MutationObserver 实例，用于监听 DOM 变化
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 如果添加的节点数为 0，则直接返回，不进行任何操作
      if (mutation.addedNodes.length === 0) {
        return;
      }

      // 遍历新添加的节点
      mutation.addedNodes.forEach((node) => {
        // 检查节点是否为 HTMLElement 类型，以确保只处理 HTML 元素节点
        if (node instanceof HTMLElement) {
          // 在新添加的节点中查找带有 data-animation 属性的元素
          const animationItems = node.querySelectorAll('[data-animation]');
          // 对找到的带有 data-animation 属性的元素进行处理
          observeAnimationItems(animationItems);

          // 在新添加的节点中查找带有 data-lazy 属性的元素
          const lazyloadItems = node.querySelectorAll('[data-lazy]');
          // 对找到的带有 data-lazy 属性的元素进行处理
          observeLazyloadItems(lazyloadItems);
        }
      });
    });
  });

  // 开始观察整个文档的 body 元素，配置为监视子节点的添加或删除，以及在整个子树中观察节点的变化
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

function setImageAttr(img) {
  const { lazy, placeholder, srcset } = img.dataset;
  img.src = lazy; //图片赋值

  if (srcset) {
    img.srcset = srcset;
  }

  if (placeholder) {
    img.classList.add(`bg-[url('${placeholder}')]`);
  }
}

/**
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 */
function matchParent(node, parent) {
  if (!node.parentElement) {
    return false;
  }

  if (node.parentElement === parent) {
    return true;
  }

  return matchParent(node.parentElement, parent);
}

/**
 * 轮播图dom对象
 * data-lazy懒加载
 * data-placeholder占位符
 * **/
function createBannerDom(index) {
  const banner = newBannerInfos[index];

  const $carouselItem = document.createElement('div')
  $carouselItem.innerHTML = `
      <div class="carousel-item">
          <div class="carousel-content-wrapper image-loading">
            <!-- 图片 -->
            <img class="carousel-image w-full h-full object-cover"  data-lazy=${banner.image} data-src="图片路径" data-placeholder=${banner.imagePlaceholder}
                alt="横幅" srcset=${banner.imageSet}>
            <!-- 内容 -->
            <div class="carousel-content sm:justify-center">
              <!-- 标题 -->
              <div class="carousel-title sm:text-6xl">${banner.title}</div>
              <!-- 描述 -->
              <div class="carousel-description sm:mt-6 sm:text-3xl">${banner.description}</div>
            </div>
          </div>
      </div>
`
  return $carouselItem;
}

function createIndicators() {
  return Array.from({ length: newBannerInfos.length }).map(() => {
    const $indicatorItem = document.createElement('div');
    $indicatorItem.classList.add('carousel-indicator-item');
    $indicatorItem.innerHTML = `
        <svg class="progress" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle class="progress-inner-bar" cx="50" cy="50" r="40"></circle>
          <circle class="progress-bar" cx="50" cy="50" r="40" />
        </svg>
      `;

    return $indicatorItem;
  });
}