import {
  formatMultiple,
  type IndustryId,
  type ProfileId,
  type Valuation,
} from "./valuation";

/**
 * Industry context copy. `{range}` is replaced with the unadjusted industry
 * multiple range so the copy stays in step with the multiples table.
 *
 * NOTE: this copy is a template. It is meant to be reviewed and refined by
 * Aspen's valuation team before launch (see "Next Steps" in the spec).
 */
const INDUSTRY_CONTEXT: Record<IndustryId, string> = {
  manufacturing:
    "Manufacturing businesses typically trade at {range} EBITDA in Canada. Precision work and niche specialization can command the higher end of that range.",
  construction:
    "Construction and trades businesses typically trade at {range} EBITDA in Canada. Backlog quality, bonding capacity and licensed staff matter more here than revenue size.",
  distribution:
    "Distribution and logistics businesses typically trade at {range} EBITDA in Canada. Supplier agreements, customer stickiness and working capital discipline decide where you land in that band.",
  services:
    "Business services and professional firms typically trade at {range} EBITDA in Canada. Contracted recurring revenue and the depth of your second tier of staff do most of the work in setting the multiple.",
  healthcare:
    "Healthcare and medical businesses typically trade at {range} EBITDA in Canada, benefiting from recurring revenue and regulatory barriers to entry.",
  hospitality:
    "Food, beverage and hospitality businesses typically trade at {range} EBITDA in Canada, with seasonality and labour availability weighing on multiples.",
  technology:
    "Technology and software businesses typically trade at {range} EBITDA in Canada — the widest band of any sector, where you land depends almost entirely on revenue quality.",
  other:
    "Businesses outside the main sector groupings typically trade at {range} EBITDA in Canada. Without a clear sector comparable, buyers lean harder on the fundamentals: earnings quality, transferability and customer concentration.",
};

/** 8 industries x 4 profiles = 32 profile-specific insights. */
const PROFILE_CONTEXT: Record<IndustryId, Record<ProfileId, string>> = {
  manufacturing: {
    growing:
      "A growing operation with a strong team and recurring customers sits at the top of that range. Buyers will look closely at capacity headroom and whether your order book is contracted or repeat by habit.",
    stable:
      "A stable operation that runs without you day to day is exactly what strategic buyers and private equity look for in this sector. Documented processes and a reliable maintenance record support the upper half of the range.",
    "owner-dependent":
      "Owner dependency remains the most common valuation drag in manufacturing. Customer relationships, pricing decisions and shop-floor knowledge that sit with you alone are discounted heavily — addressing this before going to market can make a real difference to your final number.",
    mixed:
      "A mixed profile invites buyers to price for uncertainty. Identifying which part of the business carries the growth, and separating it clearly in your reporting, typically recovers part of that discount.",
  },
  construction: {
    growing:
      "Growth backed by a strong team and repeat clients is attractive, but buyers will test whether your backlog is contracted work or pipeline optimism. Signed multi-year work supports the top of the range.",
    stable:
      "A contractor that runs without the owner on site daily is unusual in this sector, and it prices accordingly. Project management depth and a clean safety record both support value.",
    "owner-dependent":
      "In the trades, the owner often holds the client relationships, the estimating knowledge and the licences at once. That concentration is the single biggest reason offers come in below expectations — building estimating and project management depth is the highest-return work you can do.",
    mixed:
      "Uneven project margins are the usual cause of a mixed profile. Buyers will want job-level costing to see which work actually makes money; producing it before diligence puts you in control of that conversation.",
  },
  distribution: {
    growing:
      "Growth with recurring customers is well rewarded here, particularly where you hold exclusive or long-dated supplier agreements. Buyers will check that the growth has not simply been bought with inventory.",
    stable:
      "A stable distributor that runs without daily owner involvement is a straightforward acquisition, which supports the upper half of the range. Inventory turns and warehouse systems are what buyers probe first.",
    "owner-dependent":
      "Where supplier terms and key accounts are held personally by the owner, buyers assume some of that goodwill leaves with you. Transferring relationships to named account managers ahead of a sale protects real value.",
    mixed:
      "Mixed performance in distribution usually traces back to a handful of accounts or product lines. Showing margin by customer and by line turns an uncertain story into a priced one.",
  },
  services: {
    growing:
      "Growth plus recurring customers is the strongest combination in this sector. Buyers will want to see contract lengths, renewal rates, and evidence that growth is not concentrated in one or two wins.",
    stable:
      "A firm that runs without the owner day to day is readily transferable, which supports the upper half of the range. Documented delivery methodology is what makes that claim credible in diligence.",
    "owner-dependent":
      "In professional services the owner is frequently the product. Where clients buy you rather than the firm, buyers discount heavily and push more of the price into an earn-out — moving delivery and client ownership to your team is the fastest way to change that.",
    mixed:
      "A mixed profile here often means a solid base of recurring work alongside unpredictable project revenue. Reporting the two separately lets a buyer value the recurring base properly instead of discounting the whole.",
  },
  healthcare: {
    growing:
      "Growth in healthcare is attractive but heavily scrutinized. Buyers will confirm it is supported by capacity, credentialed staff, and referral sources that do not depend on one individual.",
    stable:
      "Your stable profile values at the mid-to-high end of the range. Documentation of processes and compliance is critical — it is the first thing diligence tests, and gaps cost more here than in most sectors.",
    "owner-dependent":
      "Where the practice depends on the owner-practitioner, a buyer is really valuing a job rather than a business. Associate coverage, transferable referral sources and a credible transition plan are what unlock the upper end of the range.",
    mixed:
      "Mixed results in healthcare often reflect payer mix or staffing gaps rather than demand. Separating those effects in your reporting stops a buyer pricing the whole business for one soft segment.",
  },
  hospitality: {
    growing:
      "Growth here is rewarded where it is proven across more than one site or season. Buyers will want to see that unit economics hold as you scale, not only at the flagship.",
    stable:
      "An operation that runs without you daily is uncommon in hospitality and prices near the top of the range. Management depth, supplier terms and lease security are the three things diligence will test.",
    "owner-dependent":
      "Food and beverage businesses already face seasonality and labour challenges, and reliance on your personal involvement compounds both. Building management depth and recurring contracts — catering, corporate accounts, supply agreements — can add $200K–$500K or more to your value.",
    mixed:
      "A mixed profile usually means one strong location or line carrying softer ones. Site-level reporting lets buyers pay for the strong part instead of averaging everything down.",
  },
  technology: {
    growing:
      "Tech businesses with recurring revenue and strong growth command the top of this range. Your growth profile is attractive to buyers — focus on recurring contracts, net revenue retention and customer concentration before you go to market.",
    stable:
      "Stable, profitable software businesses that run without the founder are rarer than growth stories and price well on an EBITDA basis. Churn, contract terms and the bus factor on key engineers are the main diligence focus.",
    "owner-dependent":
      "Where the founder holds the architecture, the roadmap and the key accounts, buyers price for replacement risk. Documented systems, a second technical lead and transferable customer relationships move you materially up the range.",
    mixed:
      "Mixed signals in tech usually mean recurring revenue sitting alongside project and implementation work. Splitting the two in your reporting lets the recurring base earn its multiple rather than being averaged with services revenue.",
  },
  other: {
    growing:
      "Growth with recurring customers travels well across sectors. Where there is no obvious comparable, a clear record of repeatable demand is what justifies the top of the range.",
    stable:
      "A business that runs without the owner daily is transferable in any sector, and transferability is what the multiple is really paying for. Documentation is what proves it.",
    "owner-dependent":
      "Heavy owner dependency is discounted in every sector, and more so where buyers have few comparables to reason from. Reducing it is the single highest-return preparation you can do.",
    mixed:
      "A mixed profile with no clear sector benchmark gives buyers room to price conservatively. Clean, segmented reporting is the most effective way to narrow that range in your favour.",
  },
};

/** Industry context plus profile-specific guidance for the results page. */
export function getInsight(valuation: Valuation): string {
  const { industry, profile } = valuation;
  const range = `${formatMultiple(industry.lowMultiple)}–${formatMultiple(
    industry.highMultiple,
  )}`;

  const context = INDUSTRY_CONTEXT[industry.id].replace("{range}", range);
  const guidance = PROFILE_CONTEXT[industry.id][profile.id];

  return `${context} ${guidance}`;
}
