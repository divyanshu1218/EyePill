/**
 * Utility for setting dynamic SEO meta tags
 */

export const setSeoTags = (title, description, url, image) => {
  // Set title
  document.title = title || 'EyePill - Premium Eyewear Store';

  // Set meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = description || 'Discover premium eyewear collection - sunglasses, optical glasses, and sports eyewear.';

  // Set canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = url || window.location.href;

  // Set OG tags
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.content = title || 'EyePill - Premium Eyewear Store';

  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.content = description || 'Discover premium eyewear collection';

  if (image) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.content = image;
  }

  // Set Twitter tags
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twitterTitle) {
    twitterTitle = document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    document.head.appendChild(twitterTitle);
  }
  twitterTitle.content = title || 'EyePill - Premium Eyewear Store';

  let twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDescription) {
    twitterDescription = document.createElement('meta');
    twitterDescription.name = 'twitter:description';
    document.head.appendChild(twitterDescription);
  }
  twitterDescription.content = description || 'Discover premium eyewear collection';

  if (image) {
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.name = 'twitter:image';
      document.head.appendChild(twitterImage);
    }
    twitterImage.content = image;
  }
};

/**
 * Product page SEO
 */
export const setProductSeo = (product) => {
  const title = `${product.name} - Buy ${product.brand} ${product.category} | EyePill`;
  const description = `${product.name} - ${product.brand} ${product.category}. Price: ₹${product.newPrice || product.price}. ${product.description?.substring(0, 120)}...`;
  const url = `${window.location.origin}/product/${product.id}`;
  const image = product.image;

  setSeoTags(title, description, url, image);
};

/**
 * Category page SEO
 */
export const setCategorySeo = (category) => {
  const title = `${category} Eyewear - Buy Best ${category} Glasses | EyePill`;
  const description = `Explore our premium collection of ${category} eyewear. Find the perfect ${category} glasses for your style.`;
  const url = `${window.location.origin}/shop?category=${category}`;

  setSeoTags(title, description, url);
};

/**
 * Home page SEO
 */
export const setHomeSeo = () => {
  const title = 'EyePill - Premium Eyewear Store | Sunglasses, Optical & Sports Eyewear';
  const description = 'Shop premium eyewear at EyePill. Discover designer sunglasses, optical glasses, and sports eyewear with fast shipping and easy returns.';
  const url = window.location.origin;

  setSeoTags(title, description, url);
};

/**
 * Shop page SEO
 */
export const setShopSeo = () => {
  const title = 'Shop Eyewear - Sunglasses, Optical Glasses & More | EyePill';
  const description = 'Browse our extensive collection of eyewear including sunglasses, optical glasses, and sports eyewear. Find your perfect pair today.';
  const url = `${window.location.origin}/shop`;

  setSeoTags(title, description, url);
};
