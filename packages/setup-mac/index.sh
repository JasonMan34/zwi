#!/bin/bash
set -o errexit
set -o pipefail

REPOS_DIR="repos"

clear

DEFAULT="\x1b[0m"
BOLD="\x1b[1;37m"

ohmyzsh_installation() {
  RUNZSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
}

brew_installations() {
  brew install --cask iterm2 --force
  brew install --cask alt-tab --force
  brew install --cask rectangle --force
  brew install --cask maccy --force
  brew install --cask postman --force
  brew install --cask docker --force
  brew install --cask visual-studio-code --force
}

vscode_extensions_installations() {
  export NODE_OPTIONS="--no-deprecation"
  code --install-extension dbaeumer.vscode-eslint           # ESLint
  code --install-extension esbenp.prettier-vscode           # Prettier
  code --install-extension Gruntfuggly.todo-tree            # Todo tree
  code --install-extension wayou.vscode-todo-highlight      # Todo highlighter
  code --install-extension eamodio.gitlens                  # GitLens
  code --install-extension PKief.material-icon-theme        # Material Icon Theme
  code --install-extension vscode-icons-team.vscode-icons   # VSCode Icon Theme
  code --install-extension redhat.vscode-yaml               # YAML support
  code --install-extension ms-azuretools.vscode-docker      # Dockerfile support
  code --install-extension xabikos.JavaScriptSnippets       # JavaScript (ES6) snippet
}

nvm_setup() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

  nvm install --lts
  nvm alias default lts/*
  corepack enable
}

# Ensure Homebrew is installed
if ! command -v "brew" &>/dev/null; then
  echo "No Homebrew on system, attempting to install..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  . ~/.zshrc
fi

## All good, let's run the script!
ohmyzsh_installation
brew_installations
vscode_extensions_installations
nvm_setup
