/**
 * A type that encapsulates the important links for a Brawler, including:
 * the brawler's icon link, a map from the brawler's star power name to icon
 * links, and a map from the brawler's gadget name to icon links
 */
export type brawlerURLS = {
  brawler: string;
  starPowers: Map<[number, string], string>; // [starPowerName, starPowerID]
  gadgets: Map<[number, string], string>; //// [gadgetName, gadgetID]
};

/**
 * Produces a map from brawler names to brawler URLS by making a request to an
 * external API, different from the official Supercell one.
 * @returns A map from brawler names to brawler URLS
 */
export async function populateIcons(): Promise<Map<string, brawlerURLS>> {
  const iconMap = new Map<string, brawlerURLS>();
  const response = await fetch("https://api.brawlapi.com/v1/brawlers");
  const json = await response.json();
  const data = json.list;

  for (const brawler of data) {
    let brawlerUrl: brawlerURLS = {
      brawler: "",
      starPowers: new Map<[number, string], string>(),
      gadgets: new Map<[number, string], string>(),
    };

    brawlerUrl.brawler = brawler.imageUrl;
    for (const starPower of brawler.starPowers) {
      brawlerUrl.starPowers.set(
        [starPower.id, starPower.name],
        starPower.imageUrl
      );
    }
    for (const gadget of brawler.gadgets) {
      brawlerUrl.gadgets.set([gadget.id, gadget.name], gadget.imageUrl);
    }
    iconMap.set(brawler.name, brawlerUrl);
  }
  return iconMap;
}
