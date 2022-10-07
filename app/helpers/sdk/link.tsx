export const convertDeepLink = (deepLink: string): string => {
  const link = deepLink
    .replace('ImpactMediaPartnerId2', '2850210')
    .replace('ImpactAdId2', '1103265')
    .replace('ImpactCampaignId2', '13416');

  return link;
};
