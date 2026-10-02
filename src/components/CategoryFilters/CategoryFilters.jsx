import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { DISCOVERY_SORTS, DISCOVERY_TYPES, isProfessionalType } from "../../utils/discoveryState";
import styles from "./CategoryFilters.module.css";

const FilterBody = ({ filters, cities, onChange, onReset, idPrefix }) => {
  const hasActive = Boolean(filters.search || filters.type || filters.city || filters.sort !== "recommended");
  return <div className={styles.filterBody}>
    <div className={styles.filterHead}>
      <span className={styles.filterHeadLabel}><SlidersHorizontal size={14} aria-hidden="true" /> Filters</span>
      {hasActive && <button className={styles.resetBtn} onClick={onReset} aria-label="Reset all filters">Reset</button>}
    </div>
    <div className={styles.group}>
      <label className={styles.groupLabel} htmlFor={`${idPrefix}-search`}>Search this category</label>
      <form onSubmit={(event) => { event.preventDefault(); onChange("search", event.currentTarget.elements.search.value.trim()); }}>
        <div className={styles.selectWrap}><input id={`${idPrefix}-search`} name="search" key={filters.search} defaultValue={filters.search} className={styles.select} placeholder="Name or specialty" /><Search size={13} className={styles.selectIcon} aria-hidden="true" /></div>
      </form>
    </div>
    <div className={styles.group}>
      <label className={styles.groupLabel} htmlFor={`${idPrefix}-type`}>Listing Type</label>
      <div className={styles.selectWrap}><select id={`${idPrefix}-type`} className={styles.select} value={filters.type} onChange={(event) => onChange("type", event.target.value)}>
        <option value="">All listing types</option>
        {DISCOVERY_TYPES.map(([value, label]) => <option key={value} value={value} disabled={Boolean(filters.city) && isProfessionalType(value)}>{label}</option>)}
      </select><ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" /></div>
    </div>
    <div className={styles.group}>
      <label className={styles.groupLabel} htmlFor={`${idPrefix}-city`}>City</label>
      <div className={styles.selectWrap}><select id={`${idPrefix}-city`} className={styles.select} value={filters.city} disabled={isProfessionalType(filters.type)} onChange={(event) => onChange("city", event.target.value)}>
        <option value="">All cities</option>
        {cities.map((city) => <option key={city.id || city._id} value={city.slug}>{city.name}</option>)}
      </select><ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" /></div>
    </div>
    <div className={styles.group}>
      <label className={styles.groupLabel} htmlFor={`${idPrefix}-sort`}>Sort By</label>
      <div className={styles.selectWrap}><select id={`${idPrefix}-sort`} className={styles.select} value={filters.sort} onChange={(event) => onChange("sort", event.target.value)}>
        {DISCOVERY_SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select><ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" /></div>
    </div>
    <p className={styles.note}>{isProfessionalType(filters.type) ? "City filtering applies to venue listings only." : "Filters update the shared Gymssy marketplace results."}</p>
  </div>;
};

export default function CategoryFilters({ filters, cities = [], onChange, onReset, totalResults }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <>
    <aside className={styles.sidebar} aria-label="Filter listings"><FilterBody filters={filters} cities={cities} onChange={onChange} onReset={onReset} idPrefix="sidebar" /></aside>
    <div className={styles.mobileBar} role="toolbar" aria-label="Filter and sort">
      <button className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)} aria-label="Open filters" aria-expanded={drawerOpen} aria-controls="filter-drawer"><SlidersHorizontal size={14} aria-hidden="true" /> Filters</button>
      <div className={styles.mobileSortWrap}><select className={styles.mobileSelect} value={filters.sort} onChange={(event) => onChange("sort", event.target.value)} aria-label="Sort listings">{DISCOVERY_SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={13} className={styles.selectIcon} aria-hidden="true" /></div>
      <span className={styles.mobileCount} aria-live="polite">{totalResults.toLocaleString()} found</span>
    </div>
    <AnimatePresence>{drawerOpen && <>
      <motion.div className={styles.backdrop} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setDrawerOpen(false)} />
      <motion.div id="filter-drawer" className={styles.drawer} role="dialog" aria-modal="true" aria-label="Filters" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <div className={styles.drawerHead}><span className={styles.drawerTitle}>Filters</span><button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close filters"><X size={17} /></button></div>
        <div className={styles.drawerBody}><FilterBody filters={filters} cities={cities} onChange={onChange} onReset={onReset} idPrefix="drawer" /></div>
        <div className={styles.drawerFooter}><button className={styles.applyBtn} onClick={() => setDrawerOpen(false)}>Show {totalResults.toLocaleString()} Results</button></div>
      </motion.div>
    </>}</AnimatePresence>
  </>;
}
