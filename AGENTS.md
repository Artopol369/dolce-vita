# AGENTS.md — для AI-агентов, заходящих в проект

> Этот файл — точка входа для любого автономного AI-агента (Anti-Gravity / Cursor / Codex / Claude Code / Aider), которому Артём передал репозиторий и сказал «продолжай».

## Read order (mandatory)

1. **[docs/master-prompt-antigravity.md](docs/master-prompt-antigravity.md)** — полный брифинг роли, бренда, стека, правил DSGVO и запретов. **Это твой главный документ.**
2. [README.md](README.md) — структура, npm-команды, importer.
3. [docs/superpowers/specs/2026-05-21-la-dolce-gera-site-and-importer-design.md](docs/superpowers/specs/2026-05-21-la-dolce-gera-site-and-importer-design.md) — design spec (15 разделов, single source of truth по решениям v1).
4. [docs/v2-ideas-and-gaps.md](docs/v2-ideas-and-gaps.md) — что слабо в v1, 3 направления для v2.

## Что **ты НЕ ДОЛЖЕН** делать

- ❌ Запускать `git push --force` или переписывать историю.
- ❌ Деплоить `npx vercel --prod` без явной команды.
- ❌ Добавлять Google Fonts / Google Maps / любую внешнюю CDN без cookie-banner.
- ❌ Тащить React-runtime / SPA-роутинг — сайт max-static.
- ❌ Создавать customer-аккаунты / online checkout / payment integration.
- ❌ Менять `docs/superpowers/specs/...` без согласования с Артёмом.

## Что **ты ДОЛЖЕН** делать

- ✅ Перед изменением кода — прочитать master-prompt полностью.
- ✅ Любое изменение i18n → синхронизировать `de.json` + `uk.json`.
- ✅ Перед коммитом — `npm run check` + `npm run build`.
- ✅ Контент в `src/content/` менять через **importer**, не вручную.
- ✅ Соблюдать дизайн-токены из `src/styles/global.css`.

## Live-стейт

- **Production preview:** https://dolcevitta-tawny.vercel.app
- **Vercel project:** logiartem8-6417s-projects/dolcevitta
- **Git:** Artopol369/dolce-vita (v1 — этот коммит)

## Контакт

Все вопросы по содержанию / приоритетам → Артём (он же владелец репо).
Все вопросы по бренду / юр.данным → пока в спеке как плейсхолдеры, владелица бизнеса Дарья Громова (информация ещё не подтверждена).
