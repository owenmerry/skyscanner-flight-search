export interface SkyscannerAPIContentPagesResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: SkyscannerAPIContentPageResponse[];
}

export interface SkyscannerAPIContentPageResponse {
  sys: ContentfulSystem;
  fields: {
    slug: string;
    name: string;
    components: ContentfulComponent[];
  };
}

export interface ContentfulComponent {
  sys: ContentfulSystem;
  fields: { [key: string]: ContentfulField };
}

export type ContentfulField = string | boolean | number;

export interface ContentfulSystem {
  space: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  revision: string;
  contentType: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
  locale: string;
}
