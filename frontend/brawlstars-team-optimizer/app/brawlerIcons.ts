export type brawlerURLS = {
  brawler: string;
  starPowers: Map<string, string>;
  gadgets: Map<string, string>;
};

export async function populateIcons(): Promise<Map<string, brawlerURLS>> {
  const iconMap = new Map<string, brawlerURLS>();
  const response = await fetch("https://api.brawlapi.com/v1/brawlers");
  const data = await response.json();

  for (const brawler of data) {
    let brawlerUrl: brawlerURLS = {
      brawler: "",
      starPowers: new Map<string, string>(),
      gadgets: new Map<string, string>(),
    };

    brawlerUrl.brawler = brawler.imageUrl;
    for (const starPower of brawler.starPowers) {
      brawlerUrl.starPowers.set(starPower.name, starPower.imageUrl);
    }
    for (const gadget of brawler.gadgets) {
      brawlerUrl.gadgets.set(gadget.name, gadget.imageUrl);
    }
    iconMap.set(brawler.name, brawlerUrl);
  }
  return iconMap;
}

export const iconMap: Promise<Map<string, brawlerURLS>> = populateIcons();
