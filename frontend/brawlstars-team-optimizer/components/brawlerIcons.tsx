export type brawlerURLS = {
  brawler: string;
  starPowers: Map<[string, number], string>; // [starPowerName, starPowerID]
  gadgets: Map<[string, number], string>; //// [gadgetName, gadgetID]
};

export async function populateIcons(): Promise<Map<string, brawlerURLS>> {
  const iconMap = new Map<string, brawlerURLS>();
  const response = await fetch("https://api.brawlapi.com/v1/brawlers");
  const json = await response.json();
  const data = json.list;

  for (const brawler of data) {
    let brawlerUrl: brawlerURLS = {
      brawler: "",
      starPowers: new Map<[string, number], string>(),
      gadgets: new Map<[string, number], string>(),
    };

    brawlerUrl.brawler = brawler.imageUrl;
    for (const starPower of brawler.starPowers) {
      brawlerUrl.starPowers.set([starPower.name, starPower.id], starPower.imageUrl);
    }
    for (const gadget of brawler.gadgets) {
      brawlerUrl.gadgets.set([gadget.name, gadget.id], gadget.imageUrl);
    }
    iconMap.set(brawler.name, brawlerUrl);
  }
  return iconMap;
}

// async function getBrawlerIcons(brawlerID: number): Promise<brawlerURLS> {
//   const response = await fetch(`https://api.brawlapi.com/v1/brawlers/${brawlerID}`);
//   const data = await response.json();

//   let brawlerUrl: brawlerURLS = {
//     brawler: "",
//     starPowers: new Map<string, string>(),
//     gadgets: new Map<string, string>(),
//   };

//   brawlerUrl.brawler = data.imageUrl;
//   for (const starPower of data.starPowers) {
//     brawlerUrl.starPowers.set(starPower.name, starPower.imageUrl);
//   }
//   for (const gadget of data.gadgets) {
//     brawlerUrl.gadgets.set(gadget.name, gadget.imageUrl);
//   }
//   return brawlerUrl;
// }
