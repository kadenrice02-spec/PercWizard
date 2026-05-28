import assert from "node:assert/strict";
import { navItems, signals, reportItems, filterSignals, getSignalCategories } from "../lib/govsignal-data.js";

assert.equal(navItems.includes("GitHub"), true, "Navigation should include GitHub");
assert.equal(filterSignals(signals, "dell", "All").some((signal) => signal.ticker === "DELL"), true, "DELL search should find Dell signal");
assert.equal(filterSignals(signals, "", "Defense Software").every((signal) => signal.category === "Defense Software"), true, "Category filter should only return Defense Software");
assert.equal(getSignalCategories(signals)[0], "All", "Categories should start with All");
assert.equal(reportItems.some((item) => item.schedule.includes("Wednesday")), true, "Reports should include Wednesday schedule");
assert.equal(reportItems.some((item) => item.schedule.includes("Friday")), true, "Reports should include Friday schedule");

console.log("GovSignal smoke tests passed.");
