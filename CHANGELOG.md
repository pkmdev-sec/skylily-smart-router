# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-28

### Added
- Initial production release
- Task complexity analyzer with 5 tiers (nano, light, standard, heavy, ultra)
- Smart routing based on task analysis
- Support for 11 models across 3 providers (Anthropic, OpenAI, Google)
- CLI tool (`smart-router`) for command-line usage
- Configuration options (provider preference, cost limits, capability requirements)
- Usage tracking and statistics
- Comprehensive test suite with 80%+ coverage
- TypeScript types exported
- Custom error classes with helpful messages
- Examples directory with real-world usage patterns

### Models Supported
- **Anthropic**: Claude Opus 4.5, Claude Sonnet 4.5, Claude Haiku
- **OpenAI**: o3, GPT-5.2 Codex, GPT-4.1, GPT-4.1 Mini, GPT-4.1 Nano
- **Google**: Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.5 Flash Lite

## [0.1.0] - 2025-01-28

### Added
- Initial prototype
- Basic task analysis
- Simple routing logic
