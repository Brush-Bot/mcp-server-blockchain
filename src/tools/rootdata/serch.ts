import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as cheerio from "cheerio";
import { getToolOutput } from "../../utils/tools.js";

export const registerRootDataSearchTool = (server: McpServer) => {
  server.tool(
    "search_rootdata_projects",
    "Search web3 project on rootdata, get list",
    {
      keywords: z.string().optional().describe("Keywords to search"),
    },
    async ({ keywords }) => {
      const res = await fetch(
        `https://www.rootdata.com/zh/search?keywords=${keywords}`,
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh",
            "cache-control": "no-cache",
            pragma: "no-cache",
            priority: "u=0, i",
            "sec-ch-ua":
              '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
        }
      );
      const html = await res.text();
      const $ = cheerio.load(html);

      const rows = $(".infinite-list.list .list_item");
      const data: {
        name: string;
        desc: string;
        tags?: string[];
      }[] = [];
      rows.each((_, row) => {
        const name = $(row)
          .find(".item_info h4 span:nth-child(1)")
          .text()
          .trim();
        const desc = $(row).find(".item_info .intro").text().trim();
        const tags = $(row)
          .find(".item_info .tags .tag")
          .map((index, item) => {
            const tag = $(item).text().trim();
            return tag;
          })
          .get();

        data.push({
          name,
          desc,
          tags,
        });
      });

      return getToolOutput({
        list: data.filter((item) => !!item.tags?.length),
      });
    }
  );
};
