export type Locale = "vi" | "en";

export interface LanguageOption {
  code: Locale;
  label: string;
  sub: string;
  short: string;
}

export type HeaderTranslations = {
  brand_aria: string;
  main_nav_aria: string;
  nav_intro: string;
  nav_how_it_works: string;
  nav_faq: string;
  nav_about_us: string;
  login: string;
  account: string;
  logout: string;
  logout_aria: string;
  mobile_menu_open: string;
  mobile_menu_close: string;
  mobile_nav_aria: string;
  lang_trigger_aria: string;
  lang_modal_eyebrow: string;
  lang_modal_title: string;
  lang_modal_close_aria: string;
  lang_search_placeholder: string;
  lang_search_aria: string;
  lang_list_aria: string;
  lang_no_results: string;
  drawer_lang_label: string;
  drawer_lang_aria: string;
  theme_light: string;
  theme_dark: string;
  theme_toggle_aria: string;
};

export type HeroTranslations = {
  title_line1_pre: string;
  title_line1_em: string;
  title_line2_pre: string;
  title_line2_em: string;
  description: string;
  cta: string;
};

export type StoryTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  start_with_bob: string;
  learn_more: string;
  play_video: string;
  play_bg: string;
  pause_bg: string;
  close_video: string;
  caption: string;
  duration: string;
  fullscreen: string;
  error: string;
  retry: string;
  video_aria: string;
  section_aria: string;
};

export type ConnectionTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  heading_line3: string;
  description: string;
  link: string;
};

export type BobTranslations = {
  eyebrow: string;
  assistant_badge: string;
  greeting_line1: string;
  greeting_line2: string;
  heading_line1_pre: string;
  heading_line1_em: string;
  heading_line2: string;
  description: string;
  benefit1_title: string;
  benefit1_desc: string;
  benefit2_title: string;
  benefit2_desc: string;
  benefit3_title: string;
  benefit3_desc: string;
  cta: string;
};

export type HowItWorksTranslations = {
  eyebrow: string;
  heading_pre: string;
  heading_em: string;
  description: string;
  step1_label: string;
  step1_title: string;
  step1_desc: string;
  step2_label: string;
  step2_title: string;
  step2_desc: string;
  step3_label: string;
  step3_title: string;
  step3_desc: string;
  step4_label: string;
  step4_title: string;
  step4_desc: string;
};

export type ProjectTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2_pre: string;
  heading_line2_em: string;
  description: string;
  cta: string;
  photo_alt: string;
};

export type PartnersTranslations = {
  eyebrow: string;
  heading: string;
  description: string;
  organizations_aria: string;
  org_nttu: string;
  org_njec: string;
  org_niic: string;
  matching_heading: string;
  match_goal_title: string;
  match_goal_desc: string;
  match_skills_title: string;
  match_skills_desc: string;
  match_schedule_title: string;
  match_schedule_desc: string;
};

export type FaqSectionTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2_pre: string;
  heading_line2_em: string;
  description: string;
  meet_team: string;
};

export type FooterTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  description_line1: string;
  description_line2: string;
  find_teammates: string;
  nav_aria: string;
  about_us: string;
  mission: string;
  terms: string;
  privacy: string;
  cookies: string;
  tagline: string;
};

export type MissionDialogTranslations = {
  trigger: string;
  title: string;
  close_aria: string;
  belief: string;
  context: string;
  quote: string;
  closing: string;
  understood: string;
};

export type CommonTranslations = {
  skip_to_content: string;
  back_to_top: string;
  back_to_home: string;
  policy_eyebrow: string;
  policy_updated: string;
};

export type AboutTranslations = {
  eyebrow: string;
  heading_line1: string;
  heading_line2: string;
  description: string;
  meet_team: string;
  team_eyebrow: string;
  team_heading: string;
  team_description: string;
};

export type MetadataTranslations = {
  home_description: string;
  about_description: string;
  login_description: string;
  register_description: string;
  forgot_description: string;
  user_description: string;
  privacy_description: string;
  terms_description: string;
  cookies_description: string;
  share_image_alt: string;

  description: string;
  home: string;
  about: string;
  login: string;
  register: string;
  forgot: string;
  user: string;
  terms: string;
  privacy: string;
  cookies: string;
};

export type AuthTranslations = {
  login_title: string;
  register_title: string;
  forgot_title: string;
  intro_find: string;
  intro_teammates: string;
  intro_project: string;
  intro_profile: string;
  intro_bob: string;
  intro_match: string;
  intro_aria: string;
  photo_alt: string;
  google: string;
  google_unavailable: string;
  email_divider: string;
  email: string;
  email_placeholder: string;
  password: string;
  password_placeholder: string;
  new_password_placeholder: string;
  full_name: string;
  name_placeholder: string;
  remember: string;
  forgot: string;
  login: string;
  register: string;
  signup: string;
  no_account: string;
  has_account: string;
  forgot_unavailable: string;
  send_reset: string;
  back_login: string;
  registered: string;
  logged_out: string;
  show_password: string;
  hide_password: string;
  show: string;
  hide: string;
  limit: string;
  check_fields: string;
  email_required: string;
  email_invalid: string;
  email_max: string;
  password_required: string;
  password_max: string;
  password_min: string;
  name_min: string;
  name_max: string;
  request_error: string;
  invalid_credentials: string;
  email_exists: string;
  rate_limit: string;
  service_unavailable: string;
};

export type OnboardingTranslations = {
  step_intro: string;
  step_profile: string;
  step_confirm: string;
  step_permissions: string;
  steps_aria: string;
  authenticating: string;
  redirecting: string;
  retry: string;
  eyebrow: string;
  hello: string;
  bob: string;
  description: string;
  feature1_title: string;
  feature1_description: string;
  feature2_title: string;
  feature2_description: string;
  feature3_title: string;
  feature3_description: string;
  start: string;
  welcome_title: string;
  welcome_description: string;
  bob_alt: string;
};

export type AccessibilityTranslations = {
  loading: string;
  photo_main: string;
  photo_student: string;
  photo_team: string;
};

export type TranslationDictionary = {
  analytics: { title: string; description: string; learn_more: string; accept: string; decline: string; settings: string };
  accessibility: AccessibilityTranslations;
  onboarding: OnboardingTranslations;
  auth: AuthTranslations;
  metadata: MetadataTranslations;
  header: HeaderTranslations;
  hero: HeroTranslations;
  story: StoryTranslations;
  connection: ConnectionTranslations;
  bob: BobTranslations;
  how_it_works: HowItWorksTranslations;
  project: ProjectTranslations;
  partners: PartnersTranslations;
  faq: FaqSectionTranslations;
  footer: FooterTranslations;
  mission: MissionDialogTranslations;
  common: CommonTranslations;
  about: AboutTranslations;
};

type Prev = [never, 0, 1, 2, 3];

export type NestedKeyOf<T, Depth extends number = 2> = [Depth] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K], Prev[Depth]>}`
        : `${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationDictionary>;
