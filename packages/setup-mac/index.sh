#!/bin/bash
set -o errexit
set -o pipefail

REPOS_DIR="repos"

############################# SCRIPT #############################
clear
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

DEFAULT="\x1b[0m"
BOLD="\x1b[1;37m"

ohmyzsh_installation() {
  RUNZSH=no sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
}

brew_installations() {
  # nvm needs to add lines to .zshrc to fully install
  brew install nvm --force

  local loadNvm
  read -r -d '' loadNvm <<EOF
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
EOF
  echo "$loadNvm" >>"$HOME/.zshrc"
  eval "$loadNvm"

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

setup_nvm() {
  nvm install lts/iron
  nvm alias default lts/iron
  nvm use default
  corepack enable
}

# Ensure Homebrew is installed
if ! command -v "brew" &>/dev/null; then
  echo "Please install Homebrew then run the script again"
  exit 1
fi

## All good, let's run the script!
ohmyzsh_installation
brew_installations
vscode_extensions_installations
setup_nvm
