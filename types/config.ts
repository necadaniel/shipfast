export type Theme =
  | "light"
  | "dark"
  | "cupcake"
  | "bumblebee"
  | "emerald"
  | "corporate"
  | "synthwave"
  | "retro"
  | "cyberpunk"
  | "valentine"
  | "halloween"
  | "garden"
  | "forest"
  | "aqua"
  | "lofi"
  | "pastel"
  | "fantasy"
  | "wireframe"
  | "black"
  | "luxury"
  | "dracula"
  | "";

export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  plans?: {
    free: {
      maxProjects: number;
      maxDevices: number;
      maxVariablesPerProject: number;
      features: string[];
    };
    solo: {
      maxProjects: number;
      maxDevices: number;
      maxVariablesPerProject: number;
      features: string[];
    };
    team: {
      maxProjects: number; // -1 means unlimited
      maxDevices: number; // -1 means unlimited
      maxVariablesPerProject: number; // -1 means unlimited
      features: string[];
    };
  };
  crisp: {
    id?: string;
    onlyShowOnRoutes?: string[];
  };
  stripe: {
    plans: {
      isFeatured?: boolean;
      priceId: string;
      name: string;
      description?: string;
      price: number;
      priceAnchor?: number;
      features: {
        name: string;
      }[];
    }[];
  };
  aws?: {
    bucket?: string;
    bucketUrl?: string;
    cdn?: string;
  };
  resend: {
    fromNoReply: string;
    fromAdmin: string;
    supportEmail?: string;
  };
  colors: {
    theme?: Theme;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}
