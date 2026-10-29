/**
 * GROQ queries for the "Sanity cms" Studio (../Sanity cms).
 * Sections are projected into render-ready shapes: links get an `href`,
 * images their CDN url + hotspot, reusable sections are inlined.
 */

const IMAGE = `{
  alt,
  hotspot,
  "url": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
}`;

const LINK = `{
  _key,
  label,
  "href": select(
    linkType == "external" => url,
    linkType == "collection" && defined(collection.handle) => "/collections/" + collection.handle,
    linkType == "product" && defined(product.handle) => "/products/" + product.handle,
    reference->_type == "home" => "/",
    reference->_type == "page" => "/pages/" + reference->slug.current
  )
}`;

const RICH_TEXT = `[]{
  ...,
  markDefs[]{
    ...,
    _type == "link" => ${LINK}
  }
}`;

const SECTION_FIELDS = `
  _key,
  _type,
  settings,
  _type == "heroSection" => {
    eyebrow, title, text, height, contentPosition, overlayOpacity,
    image ${IMAGE},
    mobileImage ${IMAGE},
    ctas[] ${LINK}
  },
  _type == "richTextSection" => {
    title, alignment, width,
    content ${RICH_TEXT},
    cta ${LINK}
  },
  _type == "imageWithTextSection" => {
    eyebrow, title, imagePosition,
    image ${IMAGE},
    content ${RICH_TEXT},
    cta ${LINK}
  },
  _type == "productRailSection" => {
    title, source, limit, layout,
    carousel{slidesDesktop, slidesMobile, showArrows, showPagination, loop, autoplay, autoplayDelay},
    "collectionHandle": collection.handle,
    "productHandles": products[].handle,
    cta ${LINK}
  },
  _type == "editorialCarouselSection" => {
    eyebrow, title, subtitle, imagePosition, source, limit,
    image ${IMAGE},
    carousel{slidesDesktop, slidesMobile, showArrows, showPagination, loop, autoplay, autoplayDelay},
    "collectionHandle": collection.handle,
    "productHandles": products[].handle,
    cta ${LINK}
  },
  _type == "collectionListSection" => {
    title, columns,
    items[]{_key, label, "handle": collection.handle, image ${IMAGE}}
  },
  _type == "promoBannerSection" => {
    title, text,
    image ${IMAGE},
    cta ${LINK}
  },
  _type == "faqSection" => {
    title,
    items[]{_key, question, answer ${RICH_TEXT}}
  },
  _type == "mainCollectionSection" => {showTitle, showDescription, productsPerPage, columnsDesktop},
  _type == "mainProductSection" => {galleryLayout, showVendor, showDescription}
`;

/** Section list; a reusable section keeps the placement's _key and points edits to its own document. */
const SECTIONS = `sections[]{
  _type == "reusableSectionRef" => section->section[0]{
    ${SECTION_FIELDS},
    "_source": {"id": ^.section->_id, "type": "reusableSection", "path": "section[0]"}
  }{..., "_key": ^._key, "_placementHidden": ^.hidden},
  _type != "reusableSectionRef" => {${SECTION_FIELDS}}
}`;

const SEO = `seo{title, description, noIndex, "image": image.asset->url}`;

export const HOME_QUERY = `*[_type == "home" && _id == "home"][0]{
  _id, _type,
  ${SECTIONS},
  ${SEO}
}`;

const TEMPLATE = `{_id, _type, name, ${SECTIONS}}`;

export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  _id, _type, title, layout,
  ${SECTIONS},
  ${SEO},
  "template": coalesce(
    *[_type == "template" && _id == $previewTemplate && templateType == "page"][0],
    template->,
    *[_type == "template" && templateType == "page" && isDefault == true][0]
  ) ${TEMPLATE}
}`;

/**
 * Template of a collection/product: the one picked on its document, else the
 * default of that type. In preview, `$previewTemplate` (from the Studio's
 * "Anteprima su") shows a specific template.
 */
export const RESOURCE_TEMPLATE_QUERY = `coalesce(
  *[_type == "template" && _id == $previewTemplate && templateType == $type][0],
  *[_type == $type && shopify.handle == $handle][0].template->,
  *[_type == "template" && templateType == $type && isDefault == true][0]
) ${TEMPLATE}`;
