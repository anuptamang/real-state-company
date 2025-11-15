import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksContactForm extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contact-form';
  info: {
    description: '';
    displayName: 'contact-form';
    icon: 'apps';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface BlocksContent extends Struct.ComponentSchema {
  collectionName: 'components_blocks_content';
  info: {
    description: '';
    displayName: 'content';
    icon: 'apps';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_ctas';
  info: {
    displayName: 'cta';
    icon: 'apps';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.Component<'shared.icon', false>;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksFeatures extends Struct.ComponentSchema {
  collectionName: 'components_blocks_features';
  info: {
    displayName: 'features';
    icon: 'apps';
  };
  attributes: {
    features: Schema.Attribute.Component<'shared.feature', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface BlocksGoogleMap extends Struct.ComponentSchema {
  collectionName: 'components_blocks_google_maps';
  info: {
    displayName: 'google-map';
    icon: 'apps';
  };
  attributes: {
    address: Schema.Attribute.String & Schema.Attribute.Required;
    apiKey: Schema.Attribute.String;
    latitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    longitude: Schema.Attribute.Decimal & Schema.Attribute.Required;
    pinInfo: Schema.Attribute.Component<'shared.pin-info', false>;
    zoom: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<15>;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'hero';
    icon: 'apps';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.button', false>;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksPropertiesList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_properties-list';
  info: {
    description: '';
    displayName: 'properties-list';
    icon: 'apps';
  };
  attributes: {
    properties: Schema.Attribute.Relation<
      'oneToMany',
      'api::property.property'
    >;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTeam extends Struct.ComponentSchema {
  collectionName: 'components_blocks_team';
  info: {
    description: '';
    displayName: 'team';
    icon: 'apps';
  };
  attributes: {
    team: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    >;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_blocks_testimonials';
  info: {
    description: '';
    displayName: 'testimonials';
    icon: 'apps';
  };
  attributes: {
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    title: Schema.Attribute.String;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_button';
  info: {
    description: '';
    displayName: 'button';
    icon: 'apps';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeature extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature';
  info: {
    description: '';
    displayName: 'feature';
    icon: 'apps';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Component<'shared.icon', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'footer';
    icon: 'apps';
  };
  attributes: {
    copyright: Schema.Attribute.String;
    menu: Schema.Attribute.Relation<'oneToOne', 'api::menu.menu'>;
    socialMedia: Schema.Attribute.Component<'shared.social-media', true>;
  };
}

export interface SharedHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_headers';
  info: {
    displayName: 'header';
    icon: 'apps';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    logoText: Schema.Attribute.String;
    menu: Schema.Attribute.Relation<'oneToOne', 'api::menu.menu'>;
  };
}

export interface SharedIcon extends Struct.ComponentSchema {
  collectionName: 'components_shared_icon';
  info: {
    description: 'Lucide icon selector';
    displayName: 'icon';
    icon: 'star';
  };
  attributes: {
    name: Schema.Attribute.Enumeration<
      [
        'activity',
        'airplay',
        'alert-circle',
        'alert-octagon',
        'alert-triangle',
        'align-center',
        'align-justify',
        'align-left',
        'align-right',
        'anchor',
        'aperture',
        'archive',
        'arrow-down',
        'arrow-left',
        'arrow-right',
        'arrow-up',
        'at-sign',
        'award',
        'bar-chart',
        'battery',
        'bell',
        'book',
        'bookmark',
        'box',
        'briefcase',
        'calendar',
        'camera',
        'check',
        'check-circle',
        'chevron-down',
        'chevron-left',
        'chevron-right',
        'chevron-up',
        'clock',
        'cloud',
        'code',
        'coffee',
        'command',
        'compass',
        'copy',
        'credit-card',
        'crop',
        'crosshair',
        'database',
        'delete',
        'dollar-sign',
        'download',
        'edit',
        'eye',
        'facebook',
        'file',
        'file-text',
        'film',
        'filter',
        'flag',
        'folder',
        'gift',
        'github',
        'globe',
        'grid',
        'hard-drive',
        'hash',
        'headphones',
        'heart',
        'help-circle',
        'home',
        'image',
        'inbox',
        'info',
        'instagram',
        'layers',
        'layout',
        'link',
        'linkedin',
        'list',
        'lock',
        'mail',
        'map',
        'map-pin',
        'maximize',
        'menu',
        'message-circle',
        'message-square',
        'mic',
        'minimize',
        'minus',
        'monitor',
        'moon',
        'more-horizontal',
        'more-vertical',
        'move',
        'music',
        'navigation',
        'package',
        'paperclip',
        'pause',
        'phone',
        'play',
        'plus',
        'plus-circle',
        'pocket',
        'power',
        'printer',
        'radio',
        'refresh-ccw',
        'refresh-cw',
        'repeat',
        'rewind',
        'rss',
        'save',
        'scissors',
        'search',
        'send',
        'server',
        'settings',
        'share',
        'shield',
        'shopping-bag',
        'shopping-cart',
        'shuffle',
        'sidebar',
        'skip-back',
        'skip-forward',
        'slack',
        'slash',
        'sliders',
        'smartphone',
        'smile',
        'speaker',
        'square',
        'star',
        'stop-circle',
        'sun',
        'sunrise',
        'sunset',
        'tablet',
        'tag',
        'target',
        'terminal',
        'thermometer',
        'thumbs-down',
        'thumbs-up',
        'toggle-left',
        'toggle-right',
        'trash',
        'trending-down',
        'trending-up',
        'triangle',
        'truck',
        'tv',
        'twitter',
        'type',
        'umbrella',
        'underline',
        'unlock',
        'upload',
        'user',
        'user-check',
        'user-minus',
        'user-plus',
        'user-x',
        'users',
        'video',
        'video-off',
        'voicemail',
        'volume',
        'volume-1',
        'volume-2',
        'volume-x',
        'watch',
        'wifi',
        'wifi-off',
        'wind',
        'x',
        'x-circle',
        'youtube',
        'zap',
        'zoom-in',
        'zoom-out',
      ]
    >;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    description: '';
    displayName: 'link';
    icon: 'apps';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: 'Media file (image, video, or document)';
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_items';
  info: {
    description: 'Menu item that can link to a page, property, or custom URL';
    displayName: 'Menu Item';
    icon: 'link';
  };
  attributes: {
    customUrl: Schema.Attribute.String;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    parentOrder: Schema.Attribute.Integer;
    property: Schema.Attribute.Relation<'oneToOne', 'api::property.property'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedPinInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_pin-info';
  info: {
    description: '';
    displayName: 'pin-info';
    icon: 'apps';
  };
  attributes: {
    address: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    description: 'Quote block with title and body';
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: 'Rich text content with formatting';
    displayName: 'Rich Text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search engine optimization metadata';
    displayName: 'SEO';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSiteInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_site-infos';
  info: {
    description: 'Site information';
    displayName: 'Site Info';
    icon: 'allergies';
    name: 'SiteInfo';
  };
  attributes: {
    defaultSeo: Schema.Attribute.Component<'shared.seo', false>;
    favicon: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    siteDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    siteName: Schema.Attribute.String & Schema.Attribute.Required;
    siteUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: 'Image slider/carousel';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_social-media';
  info: {
    description: '';
    displayName: 'social-media';
    icon: 'apps';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.contact-form': BlocksContactForm;
      'blocks.content': BlocksContent;
      'blocks.cta': BlocksCta;
      'blocks.features': BlocksFeatures;
      'blocks.google-map': BlocksGoogleMap;
      'blocks.hero': BlocksHero;
      'blocks.properties-list': BlocksPropertiesList;
      'blocks.team': BlocksTeam;
      'blocks.testimonials': BlocksTestimonials;
      'shared.button': SharedButton;
      'shared.feature': SharedFeature;
      'shared.footer': SharedFooter;
      'shared.header': SharedHeader;
      'shared.icon': SharedIcon;
      'shared.link': SharedLink;
      'shared.media': SharedMedia;
      'shared.menu-item': SharedMenuItem;
      'shared.pin-info': SharedPinInfo;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.site-info': SharedSiteInfo;
      'shared.slider': SharedSlider;
      'shared.social-media': SharedSocialMedia;
    }
  }
}
