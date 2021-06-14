FROM ubuntu:focal

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm \
    nano \
    sudo

RUN curl --remote-name https://prerelease.keybase.io/keybase_amd64.deb
RUN apt-get install -y ./keybase_amd64.deb

RUN rm /etc/apt/sources.list.d/keybase.list

RUN useradd keybase
RUN echo "Defaults env_keep += \"KBB_PORT KBB_USERNAME KBB_PAPER_KEY KBB_API_KEY\"" >> /etc/sudoers

WORKDIR /app
COPY . /app

RUN npm install

CMD ["sudo", "-u", "keybase", "node", "/app/start.js"]