
export interface TripadvisorImagesResponse {
    data: TripadvisorImagesData[];
  }
export interface TripadvisorImagesData {
    id: number;
    is_blessed: boolean;
    caption: string;
    published_date: string;
    images: {
      thumbnail: {
        height: number;
        width: number;
        url: string;
      };
      small: {
        height: number;
        width: number;
        url: string;
      };
      medium: {
        height: number;
        width: number;
        url: string;
      };
      large: {
        height: number;
        width: number;
        url: string;
      };
      original?: {
        height: number;
        width: number;
        url: string;
      };
    };
    album: string;
    source: {
      name: string;
      localized_name: string;
    };
    user: {
      username: string;
    };
  }