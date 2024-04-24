//轮播图 数据源
const newBannerInfos = [
  {
    image: './assets/official-site/banner1-lg.jpg',
    imageSet: './assets/official-site/banner1.jpg 800w, ./assets/official-site/banner1-lg.jpg 1200w',
    imagePlaceholder: './assets/official-site/banner1-xs.jpg',
    title: '开启互联网+ 从我们开始',
    description: '域名主机，网站建设，云服务器，企业邮箱一站式解决',
  },
  {
    image: './assets/official-site/banner2-lg.jpg',
    imageSet: './assets/official-site/banner2.jpg 800w, ./assets/official-site/banner2-lg.jpg 1200w',
    imagePlaceholder: './assets/official-site/banner2-xs.jpg',
    title: '新闻中心',
    description:
        '几乎所有的伟大成就，都是团队集体协作追求远大目标的结果。这些团队的领导者挑选了团队的成员，并激励他们追求自己不敢想象的成就。',
  },
  {
    image: './assets/official-site/banner3-lg.jpg',
    imageSet: './assets/official-site/banner3.jpg 800w, ./assets/official-site/banner3-lg.jpg 1200w',
    imagePlaceholder: './assets/official-site/banner3-xs.jpg',
    title: '关于我们',
    description:
        '企业构建互联网信息技术服务平台，领先技术变革，提升产业效率，致力于使能软件企业引领发展，服务制造企业转型升级，为政企客户提供“多快好省”的信息技术服务。',
  },
];
const durtation = 5000;

(function () {
  const $newsList = document.querySelector('#news-list');
  $newsList.classList.add('grid','lg:grid-cols-4','md:grid-cols-3','sm:grid-cols-2');
  if($newsList){
    $newsList.innerHTML = '';
    newsService.getRecentNews(4).then((newsList) => {
      newsList.forEach((news, i) => {
        const $newItem = createNewsItem(
            `https://loremflickr.com/320/240/dog?lock=${i}`,
            `https://loremflickr.com/320/240/dog?lock=${i}`,
            news.title,
            news.summary.substring(0,100),
            news.id,
        );
        $newsList.append($newItem);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const animationItems = document.querySelectorAll('[data-animation]');
    observeAnimationItems(animationItems);
  });

  //图片懒加载
  document.addEventListener('DOMContentLoaded', function () {
    const lazyLoaderImgList = document.querySelectorAll('img[data-lazy]');
    observeLazyloadItems(lazyLoaderImgList);
  });

  //checkPoint 毛玻璃特效
  document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.image-loading');
    images.forEach(function(image) {
      image.querySelector('img').addEventListener('load', function() {
        // 图片加载完成后，移除 "image-loading" 类
        image.classList.remove('image-loading');
      });
    });
  });

  //移动端弹出框功能
  document.addEventListener('DOMContentLoaded', function () {
    const $menu = document.querySelector('#menu');
    const $drawer = document.querySelector('#drawer');
    const $drawerCloser = document.querySelector('#drawer-close');
    const $drawerContainer = document.querySelector('#drawer-container');

    const drawerAnimation = $drawerContainer.animate(
        [
          {
            transform: `translateX(100%)`,
          },
          {
            transform: `translateX(0)`,
          },
        ],
        {
          duration: 300,
          easing: 'ease-in-out',
        },
    );

    drawerAnimation.pause();

    $menu.addEventListener('click', function () {
      $drawer.classList.toggle('drawer-active');
      $drawerContainer.style.transform = 'translateX(100%)';
      setTimeout(() => {
        drawerAnimation.playbackRate = 1;
        drawerAnimation.play();
        drawerAnimation.onfinish = () => {
          $drawerContainer.style.transform = 'translateX(0)';
        };
      }, 50);
    });

    $drawerCloser.addEventListener('click', function (e) {
      e.stopPropagation();
      drawerAnimation.playbackRate = -1;
      drawerAnimation.play();
      drawerAnimation.onfinish = () => {
        $drawerContainer.style.transform = 'translateX(100%)';
        $drawer.classList.toggle('drawer-active');
      };
    });

    $drawer.addEventListener('click',  function () {
      $drawer.classList.toggle('drawer-active');
    });
  });

  const bannerDoms = [];
  const $carousel = document.querySelector('#carousel');
  const $carouselContainer = document.querySelector('#carousel-container');
  const $carouselIndicator = document.querySelector('#carousel-indicator');
  const indicatorList = createIndicators(); //轮播图数组

  let counter = 0;
  let currentBanner = null;
  let currentIndicator = null;
  let animation = null;

  if($carouselIndicator){
    indicatorList.forEach((item) => {
      $carouselIndicator.append(item);
    });
  }

  /**
   * 鼠标悬停事件
   * **/
  if($carousel){
    $carousel.addEventListener('mouseenter', function (e) {
      if (!animation) {
        return;
      }

      animation.pause();
    });

    $carousel.addEventListener('mouseleave', function () {
      if (!animation) {
        return;
      }

      animation.play();
    });
  }

  //添加点击事件
  indicatorList.forEach((item, index) => {
    item.addEventListener('click', function () {
      bannerDoms.forEach((banner) => {
        banner.style.zIndex = -1;
      });

      animation.cancel();
      start(index);
      animation.pause();
    });
  });

  /**
   * 开始轮播函数
   */
  function start(currentIndex) {
    // 计算实际索引，防止超出范围
    const index = currentIndex % newBannerInfos.length;

    const bannerDom = createBannerDom(index); // 创建轮播图DOM
    bannerDoms[index] = bannerDom; // 将创建的轮播图DOM存储起来
    $carouselContainer.append(bannerDom); // 添加到轮播容器中

    const banner = bannerDoms[index]; // 获取当前轮播图DOM
    console.log(banner)
    const indicator = indicatorList[index]; // 获取当前指示器

    // 淡出上一个轮播图
    if (currentBanner) {
      currentBanner.classList.add('fadeout');
      currentBanner.classList.remove('fadein');
    }

    // 移除上一个指示器的活动状态
    if (currentIndicator) {
      currentIndicator.classList.remove('carousel-indicator-item-active');
    }

    // 更新当前轮播图和指示器
    currentBanner = banner;
    currentBanner.classList.add('fadein');
    currentBanner.classList.remove('fadeout');
    currentBanner.style.zIndex = currentIndex;

    currentIndicator = indicator;
    currentIndicator.classList.add('carousel-indicator-item-active');

    // 查找当前指示器对应的进度条
    const inner = Array.from( document.querySelectorAll('.progress-inner-bar'))
        .find((el) => matchParent(el.parentElement, currentIndicator));
    // 开始进度条动画
    animation = inner.animate([{ strokeDashoffset: 0 }], durtation);

    // 动画完成时，递增计数器并继续轮播
    animation.onfinish = () => {
      counter += 1;
      if (counter >= newBannerInfos.length) {
        counter = 0; // 重置计数器
      }
      start(counter);
    };
  }

  //开始播放
  if($carouselContainer){
    start(counter);
  }
})();