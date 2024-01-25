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

setup_orbit_autocomplete() {
  local orbit_autocomplete="#compdef orbit

function _orbit {
  local line

  _arguments -C \\
    '1:test:(aws_config boot git_prune_branches init_data port_forward pull purge_sqs_queues skaffold update_terminal_helpers)' \\
    '*::arg:->args'

  case \$line[1] in
  port_forward)
    _arguments '1:pods:(\$(kubectl get pods | grep mongo | awk \"{ print \\\$1 }\" | sed \"s/-mongo.*//\"))'
    ;;
  purge_sqs_queues)
    _arguments '1:prefix:(dev-)'
    ;;
  esac
}"

  local orbit_pfo_autocomplete="#compdef __orbit_port_forward

function ___orbit_port_forward {
  _arguments '1:pods:(\$(kubectl get pods | grep mongo | awk \"{ print \\\$1 }\" | sed \"s/-mongo.*//\"))'
}"

  mkdir -p "$HOME/.oh-my-zsh/completions"
  echo "$orbit_autocomplete" >"$HOME/.oh-my-zsh/completions/_orbit"
  echo "$orbit_pfo_autocomplete" >"$HOME/.oh-my-zsh/completions/___orbit_port_forward"
}

add_terminal_helpers() {
  # Slidin' this here to prevent people from pulling wrong :)
  git config --global pull.ff only

  # Change to terminal helpers directory (.../amplicy/notes-dev)
  cd "$SCRIPTPATH"
  cd "../notes-dev"

  # declaration and assignment separated for safety
  # see https://www.shellcheck.net/wiki/SC2155
  local helpersFile
  helpersFile="$(cat terminal-helpers.md)"

  local startStr="<pre id=\"script\">"
  local endStr="</pre>"
  local rest=${helpersFile#*"$startStr"}
  local script=${rest%%"$endStr"*}

  local zprofile="$HOME/.zprofile"
  local zprofile_contents
  zprofile_contents=$(cat "$zprofile")

  # Take repos/projects from previous .zprofile
  if [[ $zprofile_contents =~ (HOME/.*/amplicy) ]]; then
    script="${script/HOME\/projects\/amplicy/${BASH_REMATCH[1]}}"
  fi

  # Take username/password for orbit_init from previous .zprofile
  if [[ $zprofile_contents =~ username=(\"[!\#-~]+\") ]]; then
    script="${script/\"user\"/${BASH_REMATCH[1]}}"
  fi
  if [[ $zprofile_contents =~ password=(\"[!\#-~]+\") ]]; then
    script="${script/\"User12345!\"/${BASH_REMATCH[1]}}"
  fi

  # Take ARN from previous .zprofile
  if [[ $zprofile_contents =~ arn=\"([!\#-~]+)\" ]]; then
    script="${script/YOUR_ARN_HERE/${BASH_REMATCH[1]}}"
  fi

  # Take AWS_CONFIG from previous .zprofile
  if [[ "$zprofile_contents" =~ "AWS CONFIG" ]]; then
    script="${script}
### AWS CONFIG ###"

    while IFS= read -r line; do
      script="${script}
${line}"
    done < <(grep -o "export AWS_.*" "$zprofile")
  fi

  # Override terminal helpers
  if grep -q "############### Orbit's Terminal Helpers ###############" "$zprofile"; then
    sed -i "" "/############### Orbit's Terminal Helpers ###############/,$ d" "$zprofile"
    script="${script:1}"
  fi

  echo "$script" >>"$HOME/.zprofile"
  eval "$script"

  setup_orbit_autocomplete

  echo -e "Your ${BOLD}.zprofile${DEFAULT} has been updated with the current terminal helpers"
}

# Fast add_terminal_helpers
if ! [[ "$1" = "" ]]; then
  add_terminal_helpers
  exit 0
fi

# First time installation!

# Ensure Homebrew is installed
if ! command -v "brew" &>/dev/null; then
  echo "Please install Homebrew then run the script again"
  exit 1
fi

# Ensure AWS_PREFIX is set
if [[ "$AWS_PREFIX" = "dev-" || "$REPOS_DIR" = "" ]]; then
  echo "You have not set the config parameters. Please edit them now"
  if command -v "code" &>/dev/null; then
    code "$SCRIPT"
  else
    open -a TextEdit "$SCRIPT"
  fi

  exit 1
else
  read -r -p "Your AWS prefix is { $AWS_PREFIX }. Is that okay? [Y/n] " response
  if [[ "$response" =~ ^[nN]$ ]]; then
    echo "Cancelling..."
    exit 0
  fi
fi

## All good, let's run the script!
add_terminal_helpers
ohmyzsh_installation
brew_installations
vscode_extensions_installations
aws_cli_installation
setup_nvm
setup_dev_overlay
git config --global core.hooksPath githooks
