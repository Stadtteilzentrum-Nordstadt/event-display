# Event Display

An app to display events from a nextcloud calendar in the entry hall of the [Stadtteilzentrum Nordstadt e.V.](https://www.stadtteil-zentrum-nordstadt.de/) in Hannover.

## Development

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Setup

1. Clone the repository
2. Copy the example config file and adjust it to your needs:
   ```bash
   cp config.toml.example config.toml
   ```
3. Edit `config.toml` with your Nextcloud calendar URLs and credentials
4. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
5. Install dependencies:
   ```bash
   npx pnpm install
   ```
6. Start the development server:
   ```bash
   npx pnpm dev
   ```

The app will be available at `http://localhost:3000`.

### Development Features

- Hot reload: Changes to source files are automatically reflected
- TypeScript support with type checking
- ESLint for code quality
- Prettier for code formatting

### Useful Commands

```bash
npx pnpm dev      # Start development server
npx pnpm build    # Build for production
npx pnpm start    # Start production server
npx pnpm lint     # Run linter
```

## Running

There is a docker image available on the github package registy: `ghcr.io/stadtteilzentrum-nordstadt/event-display:main`

it can be used in a docker-compose.yml like this:

```
version: '3.8'

services:
  event-display:
    image: "ghcr.io/stadtteilzentrum-nordstadt/event-display:main"
    environment:
      CONFIG_PATH: /config.toml
    ports:
      - "3000:3000"
    volumes:
      - ./config.toml:/config.toml
```

You can also build the docker image yourself using the [Dockerfile](/Dockerfile)

## Configuration

There is a `config.toml` to configure every important aspect of the app. The path for this file can be set using the `CONFIG_PATH` environment variable. If this variable is not set, the app will look for a `config.toml` in the current working directory.

Here is an example configuration:

```toml
[frontend]
# The title of the page displayed at the top of the page
title = "Veranstaltungen in der Bürgerschule"
# The url of the logo displayed in the top right corner
icon = "/logo.png"
# The theme color, used for everything colored in the app
themeColor = "#EC6500"
# the time (in seconds) for scrolling to the next page of events when pagination is happening because of a lot of events (optional, default: 10)
scrollInterval = 10

[calendar]
# The timezone of the calendar
timeZone = "Europe/Berlin"
# The interval (in seconds) to refresh loaded events from the calendar
refreshInterval = 300
# The calendars to load events from
# name: The name of the room the calendar is for (displayed below the title of the event)
# url: The url of the calendar (found as the "Internal URL" in the nextcloud calendar settings)
# location: The location of the room the calendar is for, displayed on the right of the event list (optional, default: "")
# hideName: If the name of the room should be hidden in the event list (below the title) (optional, default: false)
calendars = [
    { name = "Raum A", url = "https://cloud.example.de/remote.php/dav/calendars/kalendar/raum-a/", location = "2. OG", hideName = false },
    { name = "Raum B", url = "https://cloud.example.de/remote.php/dav/calendars/kalendar/raum-b/", location = "2. OG", hideName = false },
]
# events that contain these keywords in their iCal categories will be ignored and not shown in the event list
ignoreKeywords = ["!intern!", "!privat!"]
# keywords that will be removed from event titles and mark events as "open end" if found in iCal categories
openEndKeywords = ["offen", "openend"]
# time in minutes after which an event is considered to be in the past and will be removed from the event list (0 means events will not be removed)
timeout = 0
# the auth information for the nextcloud instance (app password), the user must have read access to the calendars specified above
# type: The type of authentication, currently only "basic" is supported (optional)
auth = { type = "basic", username = "kalendar", password = "abcdefg" }
```

## License

This software is licensed under GNU Affero General Public License V3. For more details see LICENSE.

## Financing

This software has been built from public money. For more info, why publicly funded software should be public code, visit https://publiccode.eu/, an initiative by [Free Software Foundation Europe](https://fsfe.org/).
