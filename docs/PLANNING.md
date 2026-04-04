# Civic Spiegel
- ~Nomos Spiegel~

## Descriptor
- Civic Research Assistant
- Research for Civic Good
- Find the Facts That Matter

## Version 0: Civic Research Assistant
- local policy data and personalized civic engagement
- users ask questions about local legislation, budgets, and news, then receive summarized, contextual answers tailored to their location and concerns
- uses RAG over a vector database of scraped city council minutes, public datasets, and news articles
- build a tool that helps residents quickly understand how policies affect them, discover relevant actions (eg. meetings, petitions), and stay informed (get personalized briefings)

## Tech Stack
| Area | Tech | Deployment |
|--------|--------|--------|
| Frontend | Next.js + TypeScript + Tailwind | Vercel
| API | Python + FastAPI | Render
| Database | Neon PostgreSQL (Free Tier) | Cloud
| Vector DB | `pgvector` (PostgreSQL extension) | Cloud
| Pipeline | Python scripts + cron-job.org | Local -> DB -> Cloud
| Web Scraping | Beautiful Soup / Scrapy / PyMuPDF / Playwright (Python) | Local
| Embeddings | FastEmbed (`BAAI/bge-small-en-v1.5`) via local CPU | Local pipeline
| Precision RAG | Voyage AI Reranker (Stretch/Phase 2) | API
| LLM | Groq API (`llama-3.1-8b-instant`) | API
| ML tags | spaCy | Local
| Auth | None (`localStorage` + URL params only) | Browser
| Cron | cron-job.org (free) | Cloud

- Optional Considerations: 
    - Caching / Queues: Redis
    - ML Classification: HuggingFace zero-shot? (slow?), keyword tagging (error-prone, weaker quality) / spaCy , Llama 3‑small, Mistral‑7B‑instruct free-tier only preferred 
    - Orchestration: Airflow (open source), lightweight scripts, cron (free: https://cron-job.org/en/) preferred 
    - Web Scraping: Beautiful Soup / Scrapy / PyMuPDF / Playwright (Python)



## Big-Picture Scope
- Location: USA
- Local (NYC council / districts)
- State (NY legislature)
- ~Federal (US Congress, chambers, roll calls)~
    - local (NYC) only
    - Location, Demographics, Policy area, Policy stage, Politicians

- **Transparency / Accountability (The Omnibus Nuance):**
    - Due to the nature of "Omnibus" package bills in NY, naive roll-call tracking falsely labels politicians as hypocrites.
    - We bypass naive tracking by focusing the Data pipeline on *Committee Hearing Transcripts*, *Statements*, and *News*, allowing the LLM to explain *why* a vote happened using Semantic context.
    - **Omnibus Breakdown (Stretch Goal):** UI feature to analyze specific embedded policies mapped to parties, shifting focus from "Politicians" to "Packages".

## Main features / MVP:
- No Auth – user data in localStorage, no login/accounts
- Personalization changes how the LLM responds to the user based on demographics (Renters vs Homeowners, etc).
    - For each policy item, the ML model or rule‑based system tags, eg. "affects renters", "affects low‑income", etc. 
    - Then, apply those tags to your user’s profile (e.g., "you’re a renter, income 30–50K").
    - The UI shows "priority" for things that match their profile.


- *The pipeline currently creates a "Mock DB" locally in JSON during development, allowing the Frontend and Backend to immediately test end-to-end functionality without waiting on Neon infrastructure.*


### 1. Onboarding / User Data: 
- via a non‑blocking modal on first visit, then accessed in Settings or other
    - Q1: What borough do you live in? 
        - Manhattan
        - Queens
        - Brooklyn
        - Bronx
        - Staten Island
        - Other / Prefer not to say
    - Q2: What's your approximate annual household income? 
        - Under $25K
        - $26-50K
        - $51-75K
        - $76K-100K
        - Over $100K
        - Other / Prefer not to say
    - Q3: What's your housing status?
        - Renter (Tenant)
        - Homeowner
        - Shared Housing
        - Homeless / Unhoused
        - Other / Prefer not to say
    - Q4: Age range? 
        - Under 18
        - 18–25
        - 26–35
        - 36–50
        - 51–65
        - 65+
        - Other / Prefer not to say
    - Q5: What issues matter most to you? (multi-select options) 
        - Health
        - Armed Forces and National Security
        - Government Operations and Politics
        - International Affairs
        - Taxation
        - Crime and Law Enforcement
        - Agriculture and Food
        - Public Lands and Natural Resources
        - Transportation and Public Works
        - Finance and Financial Sector
        - Immigration
        - Education
        - Congress
        - Science, Technology, Communications
        - Environmental Protection
        - Commerce
        - Energy
        - Labor and Employment
        - Housing and Community Development
        - Foreign Trade and International Finance
        - Native Americans
        - Emergency Management
        - Civil Rights and Liberties, Minority Issues
        - Economics and Public Finance
        - Law
        - Social Welfare
        - Sports and Recreation
        - Families
        - Arts, Culture, Religion
        - Water Resources Development
        - Animals
    - Q6: Any of these apply to you? (multi-select options)
        - Student
        - Immigrant / DACA
        - Veteran
        - Disability
        - Small business owner
        - Child of US immigrants
        - Recent NYC resident
        - Single parent / Caregiver
        - LGBTQ+
        - BIPOC

- [ ] we might need more questions, or these options would span more demographic fields, like education level, gender, race/ethnicity, employment, household size, veteran status, etc.

+ NOTE (should make explicitly clear to users): All data stays in the browser. Nothing is sent to our servers without explicit consent.


### 2. Dashboard w/ very comprehensive filters:

| Filter Dimensions | Description |
| --- | --- |
jurisdiction level | local (NYC), state (NY), ~federal (US)~ | 
location | City > Borough > Council District > Zip/Neighborhood (NYC Open Data boundaries)
demographics | Income range, Housing status, Age, Immigration status, Disability, etc. (localStorage)
policy area / issues | Housing, Education, Policing, Transit, Environment, Health, Labor, Immigration, Taxation, etc.
policy stage/type of .. | Budget item, Zoning change, Legislation, Hearing, Meeting, Petition, Roll call, etc.
time ranges | Last 30 days, Last 6 months, Current session, Entire term, etc.
politicians & parties | All NYC Council members, NY State Assembly / Senate, ~US House / Senate (NY‑based only)~.
stances / impact | Affects renters, Affects homeowners, Affects low‑income, Raises taxes, Cuts services, Expands services, etc.
| + | ... etc (we can add more)


- note: each dimension probably will have more filters within, dimensions are more like umbrella groupings of filters
- ~Alternative option: we could monitor Congress (https://api.congress.gov/) instead of local/NYC – or make this a separate/stretch feature~


### 3. LLM Chat : could call this Civic Assistant (could change if project title changes)
- Purpose: to answer “How does this affect me?” for users based on personalization &/or explain policy.
- RAG from filters/personalization
- Prompt engineered to be concise, use cited/fetched information via RAG pipeline (prevent hallucination as much as possible) 
    - **Idea**: 
        - fetch chunks from `pgvector` (or Local JSON mock DB), rank with Voyage, summarize via Groq Llama 3.1.
    - Eg.
        - R1: factual summary, based on user prompt (eg. what’s this about, what can i do about it, etc.)
        - R2: “this is how it might affect you” (based on localStorage profile) – no R2 if no personalization 


### 4. Settings – (localStorage only) – page or modal
- no auth
- can be edited anytime; no backend persistence – user multiselects (all optional) demographics data 
- clear all local data button


### 5. Politician Cards – additional info, Politician Pages (similar to dashboard filter) could be a stretch feature
- Name, photo(?), age, district, party, (maybe # years serving in their current role/public policy?)
- Policy alignment scores (bar charts) eg, Housing: 72% progressive, Healthcare: 2% conservative 
- "What they said vs. what they voted" — quotes from council minutes vs. roll call record
- Recent votes list (last 10 roll calls from our documents table?)
- Contact link + upcoming meetings they're scheduled for + elections(?)

- [ ] Option / Consideration: Basic Politician Cards & Omnibus Breakdowns
    - Name, photo, alignment scores, etc.
    - *Stretch*: Voting is nuanced (eg. omnibus bills often contain both good and bad provisions, etc.). Replace card focus with Omnibus breakdown analytics.


### 6. Data Sources
| Category | Examples |
| --- | --- |
Legislation & minutes | City council minutes, ordinances, bills, agendas, PDF/HTML municipal records.
Budgets & finance | Published municipal budgets, budget hearings, line‑item PDFs or CSVs.
Public datasets | Open Data portals, Census data, housing, crime, transportation, school stats.
Local news | RSS feeds, local newspaper sites, community blogs, press releases.
Government comms | Mayor’s office releases, agency announcements, press conferences, transcripts.
User activity | Anonymous chat logs and click‑throughs (only if explicitly consented).


#### Limited to NYC / NY:
| Category | NYC / NY Data Source |
| --- | --- |
NYC Open Data portal | https://opendata.cityofnewyork.us/ 
NYC Council meetings (1999–2024) | https://data.cityofnewyork.us/City-Government/City-Council-Meetings-1999-to-2024-/m48u-yjt8/about_data 
NYC Legislation | https://legistar.council.nyc.gov/Legislation.aspx 
NYC Expense Budget (by agency) | https://data.cityofnewyork.us/City-Government/Expense-Budget/mwzb-yiwb/about_data 
NYC City Council calendar / hearings | https://legistar.council.nyc.gov/Calendar.aspx 
NYC Council Budget Dashboards (visual) | https://council.nyc.gov/budget/dashboards/ 
General NYC Open Data catalog | https://www.nyc.gov/site/designcommission/resources/designing-ny/open-data.page 
Local News | Use RSS feeds from local outlets (eg. NYT NYC section, Gothamist, local CUNY journalism projects, etc.)


### 7. Basic Data Pipeline: RAG & ML/LLM
scrape → chunk → classify (tags) → embeddings → database 

   - Eg. scrape via `BeautifulSoup` → `EmbeddingEngine` chunking via naive-split/Langchain → `FastEmbed` → `mock_db.json` → Postgres + Neon.


### 8. User Flow
- USER → homepage → (Onboarding to localStorage) → [Dashboard | LLM chat | Politicians | Settings]
    - Optional modal: “Help us show what matters to you.” (?) – or explicitly say no data is stored with us
    - Answer Qs / Skip 
    - App serializes filters to URL + localStorage (if completed) (?)
    - Advanced Filters Dashboard 
    - LLM Chat
    - Politician Cards/Profiles
    - Settings

--- 

## Example Project Structure 
```
project-name 
  - frontend/	# app, components, lib (combines frontend with api routes)
  - backend/
  - pipeline/	# data scraper, pipeline scripts, etc.?
  - cron/		# free: https://cron-job.org/en/ ; for quick/daily/minor updates to db
  - docs/ 		# documentation as needed
```



---

## Roles
- Project Manager: 
- Frontend: 
- Backend:
- Data / ML: 



## Timeline / Deadlines

| Date | Task Description | Role | Status |
|---|---|---|---|
| **Mar 27** | Project Specifications + MVP + Plan formulation | ALL | ✅ |
| **Apr 03** | Research: Domain, Scope, Data Sources, APIs, etc. | PM | ✅ |
| | Finalize MVP + Documentation (ARCHITECTURE, TEAM_ONBOARDING) | PM | ✅ |
| | Backend Schema logic mapped out (5-table architecture) | PM | ✅ |
| | Github Setup, FastAPI in `/backend` with `schema.py` | BE | ✅ |
| | Github Setup, pipeline boilerplates (`/pipeline`) | ML | ✅ |
| | Data Pipeline Setup: Offline Mock DB (JSON Export) | ML | ✅ |
| | Build initial scraper & FastEmbed engine framework | ML | ✅ |
| | Github Setup `frontend/` (Next.js + TS + Tailwind) w/ placeholders | FE | 🛠️ In Progress |
| **Apr 10** | **[NEXT]** Groq LLM + FastAPI bridge development (`/api/chat`) | BE | 🛠️ In Progress |
| | Frontend structural layouts (Navigation, Modals, Forms) | FE | ⏳ Pending |
| | ChatWindow component (LLM RAG Chat UI) | FE | ⏳ Pending |
| | Construct Dashboard UI, Settings, advanced styling | FE | ⏳ Pending |
| **Apr 17** | Deploy Database (Neon Postgres via `init_db.py`) | BE | ⏳ Pending |
| | Scrape batches of real NYT news & Legistar RSS; chunk texts | ML | ⏳ Pending |
| | Push mock JSON vectors/transcripts directly into Neon Database | ML | ⏳ Pending |
| | OnboardingModal → save logic to `localStorage` | FE | ⏳ Pending |
| | Personalization toggle + Advanced Filters on Dashboard | FE | ⏳ Pending |
| | Connect Politician Cards & Omnibus breakdown components to live Database APIs | FE | ⏳ Pending |
| **Apr 24** | *Buffer week for continuing previous tasks* | ALL | ⏳ Pending |
| | Multi-language support, accessibility tweaks | FE | ⏳ Pending |
| | Error handling, strict rate limiting | BE | ⏳ Pending |
| | Create `cron` triggers for regular scraping pipeline execution | ML | ⏳ Pending |
| **May 01** | Connect Reranker feature (Voyage AI stretch goal) | ALL | ⏳ Pending |
| **May 08** | Working MVP end-to-end integration | ALL | ⏳ Pending |
| | QA, Testing, UI Polish | ALL | ⏳ Pending |
| | Ensure all external hosting (Vercel/Render) handles traffic correctly | ALL | ⏳ Pending |
| **May 15** | Final Projects and Demos Due with Class Demos | ALL | ⏳ Pending |
