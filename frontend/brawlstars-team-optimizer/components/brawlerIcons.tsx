export type brawlerURLS = {
  brawler: string;
  starPowers: Map<[number, string], string>; // [starPowerName, starPowerID]
  gadgets: Map<[number, string], string>; //// [gadgetName, gadgetID]
};

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
      brawlerUrl.starPowers.set([starPower.id, starPower.name], starPower.imageUrl);
    }
    for (const gadget of brawler.gadgets) {
      brawlerUrl.gadgets.set([gadget.id, gadget.name], gadget.imageUrl);
    }
    iconMap.set(brawler.name, brawlerUrl);
  }
  return iconMap;
}