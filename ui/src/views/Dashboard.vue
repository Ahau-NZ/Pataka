<template>
  <div class="wrapper">
    <v-container class="px-12" fluid >
      <v-row justify="center">

        <!-- sidebar -->
        <v-col cols="4" class="pt-0">
          <Avatar
            size="180px"
            type="pataka"
            :alt="profile.preferredName"
            class="pb-4"
            :image="profile.avatarImage"
          />
          <!-- TODO allow editing the profile -->
          <h1 class="text-uppercase text-center">{{profile.preferredName}}</h1>
          <p class="grey--text text-center caption overflow-wrap">{{profile.feedId}}</p>
          <v-col cols="7" class="mx-auto mt-8">

            <!-- network status -->
            <v-row justify="start" align="center" class="py-2">
              <div
                class="dot mr-4 internet-dot"
                :class="network.internetLatency ? network.internetLatency === -1 ? 'red' : 'green' : 'grey'"
              />
              <p class="caption text-uppercase text-center ma-0">
                {{ network.internetLatency ? network.internetLatency === -1 ? 'Offline' : 'Online' : 'Checking' }}
              </p>
              <span class="network-latency">{{latency}}</span>
            </v-row>
            <v-row justify="start" align="center" class="py-2 network-local">
              <div class="dot mr-4" :class="network.ipv4 ? 'green' : 'grey'" />
              <p class="caption text-uppercase ma-0">
                {{network.ipv4 ? ' Local Network' : 'Checking'}}
              </p>
            </v-row>
             <v-row justify="start" align="center" class="py-2">
              <div
                class="dot mr-4"
                :class="network.portForwarding ? 'green' : network.internetLatency === null ? 'grey' : 'orange'"
              />
              <p class="caption text-uppercase text-center ma-0" >
                {{ network.portForwarding ? 'Port-Forwarding' : network.portForwarding === null ? 'Checking' : 'Port-Forwarding Off' }}
              </p>
            </v-row>

            <!-- disk status -->
            <v-row class="mt-8" justify="center">
              <h2 style="text-align:center;">Disk Usage</h2>
              <v-progress-linear
                v-for="disk in diskUsage"
                :key="disk.fs"
                class="mt-4"
                :value="disk.use"
                height="25"
                color="blue-grey"
              >
                <strong class="pr-2">{{ Math.ceil(disk.use) }}%</strong>
                <span class="caption">{{disk.fs}}</span>
              </v-progress-linear>
            </v-row>
            <!-- <StorageGraph /> -->

            <!-- Logout button -->
            <v-row align="center" v-if="cloudHost">
              <v-btn class="mt-6" width="100%" color="red" outlined @click="logout">
                logout
              </v-btn>
            </v-row>
          </v-col>
        </v-col>

        <!-- main body -->
        <v-col cols="8">

          <!-- generate code -->
          <v-row>
            <v-col cols="12">
              <v-btn color="#53cb62" outlined
                :disabled="network.portForwarding === null"
                @click="toggleDialog()"
              >
                {{!network.ipv4 ? 'Loading network data' : 'Generate join code'}}
              </v-btn>
            </v-col>

            <v-col v-if="generateError">
              <p class="red--text caption mb-0">{{generateError}}</p>
            </v-col>
            <v-col v-else-if="generatedInvite" cols="12"  class="generated-code pl-6">
              <v-row>
                <p class="overline pt-2">Pātaka single use code:</p>
              </v-row>
              <v-row>
                <p class="pa-2" id="invite-code">{{generatedInvite}}</p>
              </v-row>
              <v-row v-if="!cloudHost">
                <v-btn
                  color="grey"
                  outlined
                  class="text-uppercase"
                  justify="end"
                  @click="copyCode"
                >
                  <v-icon v-if="copyText === 'Copy'" small left>mdi-content-copy</v-icon>
                  <v-icon v-else small left>mdi-check</v-icon>
                  {{copyText}}
                </v-btn>
              </v-row>

            </v-col>
          </v-row>

          <!-- meters -->
          <v-row class="stat-column">
            <v-col cols=6>
              <Meter title="CPU" :values="cpuLoad" />
            </v-col>
            <v-col cols=6>
              <Meter title="RAM" :values="memoryLoad" />
            </v-col>
          </v-row>

          <!-- known profiles -->
          <v-row class="pt-6">
            <v-col cols="6" class="stat-column">
              <h2 class="h2 text-uppercase pb-8">People</h2>
              <p v-if="invitedPeople.length === 0" class="caption">There is no one connected to your network</p>
              <v-row class="pb-2">
                <div v-if="invitedPeople && invitedPeople.length > 0">
                  <AvatarGroup :profiles="invitedPeople" size="60px" showLabel/>
                </div>
              </v-row>
            </v-col>

            <v-col cols="6" class="stat-column pl-6">
              <h2 class="h2 text-uppercase pb-8">Tribes</h2>
              <p v-if="tribes.length === 0" class="caption">There are no tribes on your network</p>
              <v-row class="pb-2">
                <div v-if="tribes && tribes.length > 0">
                  <AvatarGroup :profiles="tribes" size="60px" showLabel/>
                </div>
              </v-row>
            </v-col>
          </v-row>

        </v-col>

      </v-row>
    </v-container>

    <GenerateInviteDialog
      v-if="dialog"
      :show="dialog"
      :publicIpv4="network.publicIpv4"
      :portForwarding="network.portForwarding"
      :checkPortForwarding="checkPortForwarding"
      :checkingPort="checkingPort"
      :title="`Generate Invite Code`"
      :errorMsg="errorMsg"
      @close="toggleDialog"
      @generate="generateInviteCode($event)"
    />
  </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue'
import AvatarGroup from '@/components/AvatarGroup.vue'
import GenerateInviteDialog from '@/components/GenerateInviteDialog'
import Meter from '@/components/Meter.vue'
import gql from 'graphql-tag'
// import StorageGraph from '@/components/StorageGraph.vue'

const SECONDS = 1000

export default {
  name: 'Dashboard',
  data: () => ({
    dialog: false,
    ipSet: false,
    copyText: 'Copy',
    generatedInvite: null,
    generateError: false,
    errorMsg: null,
    checkingPort: null,
    invitedPeople: [],
    tribes: [],
    profile: {
      feedId: '',
      preferredName: '',
      avatarImage: null
    },
    portForwarding: null,
    network: {
      internetLatency: null,
      ipv4: null,
      ipv6: null,
      publicIpv4: null
    },
    diskUsage: [],
    cpuLoad: [ 0, 0 ],
    memoryLoad: [ 0, 0 ]
  }),
  computed: {
    latency () {
      if (this.network.internetLatency && this.network.internetLatency !== -1) return `${this.network.internetLatency} ms`
      else return 'Unknown'
    },
    cloudHost () {
      return window.location.hostname !== 'localhost'
    }
  },
  apollo: {
    profile: {
      query: gql`query {
        whoami {
          public {
          feedId
          profile {
            id
            preferredName
            avatarImage {
              uri
            }
          }
          }
        }
      }`,
      update (data) {
        if (!data.whoami.public.profile || !data.whoami.public.profile.preferredName) this.$router.push({ name: 'login' })
        return {
          ...data.whoami.public.profile,
          feedId: data.whoami.public.feedId
        }
      }
    },
    network: {
      query: gql`query {
        network {
          ipv4
          internetLatency
          publicIpv4
          portForwarding
        }
      }`,
      pollInterval: 10 * SECONDS
    },
    portForwarding: {
      query: gql`query {
        network {
          portForwarding
        }
      }`,
      update (data) {
        return data.network.portForwarding
      }
    },
    cpuLoad: {
      query: gql`query {
        cpuLoad
      }`,
      pollInterval: 10 * SECONDS,
      update (data) {
        if (this.cpuLoad.length >= 360 || this.cpuLoad[this.cpuLoad.length - 1] === 0) {
          this.cpuLoad.pop()
        } else if (this.cpuLoad[0] === 0) {
          this.cpuLoad.shift()
        }
        return [ ...this.cpuLoad, data.cpuLoad ]
      }
    },
    memoryLoad: {
      query: gql`query {
        memoryLoad
      }`,
      pollInterval: 10 * SECONDS,
      update (data) {
        if (this.memoryLoad.length >= 360) {
          this.memoryLoad.pop()
        } else if (this.memoryLoad[0] === 0) {
          this.memoryLoad.shift()
        }
        return [ ...this.memoryLoad, data.memoryLoad ]
      }
    },
    diskUsage: {
      query: gql`query {
        diskUsage {
          use
          fs
        }
      }`,
      pollInterval: 10 * SECONDS
    },
    invitedPeople: {
      query: gql`query {
        invitedPeople {
          type
          id
          preferredName
          avatarImage {
            uri
          }
          ...on Person {
            gender
          }
        }
      }
      `,
      pollInterval: 5 * SECONDS
    },
    tribes: {
      query: gql`query {
        tribes {
          public {
            preferredName
            avatarImage {
              uri
            }
          }
        }
      }`,
      update (data) {
        return data.tribes.filter(tribe => tribe.public && tribe.public[0]).map(tribe => { return tribe.public[0] })

        // TODO check why this api is returning tribes with no public profiles?
      },
      pollInterval: 10 * SECONDS
    }
  },
  methods: {
    logout () {
      this.$router.push('/')
    },

    async toggleDialog () {
      this.dialog = !this.dialog
    },

    async generateInviteCode ({ ip, uses }) {
      const input = ip ? {
        external: ip,
        uses
      } : { uses }
      try {
        const res = await this.$apollo.mutate({
          mutation: gql`
              mutation ($input: createInviteInput) {
                createInvite(input: $input)
              }
              `,
          variables: {
            input: {
              ...input
            }
          }
        })
        this.generateError = false
        this.dialog = false
        this.generatedInvite = res.data.createInvite
        this.copyText = 'Copy'
      } catch (err) {
        console.error(err)
        this.generateError = 'something went wrong while trying to generate an invite code'
        throw err
      }
    },

    async tryInvite () {
      if (this.portForwarding) await this.generateInviteCode(this.network.publicIpv4) // eslint-disable-line
    },

    async checkPortForwarding () {
      this.checkingPort = true
      this.errorMsg = null
      const res = await this.$apollo.query({
        query: gql`query {
            network {
              portForwarding
            }
          }`
      })
      const pf = res.data.network.portForwarding
      this.portForwarding = pf
      if (pf) {
        await this.tryInvite()
        this.errorMsg = null
      } else {
        this.errorMsg = 'Port not open'
      }
      this.checkingPort = false
    },

    async copyCode () {
      navigator.clipboard.writeText(this.generatedInvite)
        .then(() => {
          this.copyText = 'Copied'
        })
        .catch(err => {
          // This can happen if the user denies clipboard permissions:
          console.error('Could not copy text: ', err)
        })
    }
  },
  components: {
    Avatar,
    AvatarGroup,
    Meter,
    GenerateInviteDialog
    // StorageGraph
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.wrapper {
  // background-color: white;
  width: 100%;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
}
.generated-code {
  min-height: 70px;
}
#invite-code {
  font-size: 0.9em;
  font-family: monospace;
  color: lightgrey;
  background:  #303030;
  border: 1px solid rgb(4, 132, 196);
  border-radius: 3px;
  user-select: all;
}
.feed-id {
  font-size: 0.9em;
}
.overflow-wrap {
  overflow-wrap: break-word;
  width: 50%;
  margin: 0 auto;
}
.dot {
  height: 15px;
  width: 15px;
  background-color: grey;
  border-radius: 50%;
  display: inline-block;
}
.green {
  background-color: rgb(74, 164, 121);
}
.orange {
  background-color: rgb(201, 158, 79);
}
.red {
  background-color: rgb(165, 50, 50);
}
.grey {
  background-color: grey;
}
.internet-dot:hover ~ .network-latency {
  left: -200px;
}
.network-latency {
  position: relative;
  left: -100vw;
  top: -10px;
  background: grey;
  height: 30px;
  width: 100px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  margin: 0 auto;
}
// .network-local {
//   margin-top: -30px !important;
// }
.stat-column {
  padding-top: 10px;
}
.log-box {
  background: var(--v-primary-base);
  opacity: 0.8;
  padding: 45px 25px 15px;
  min-height: 90%;
}
h1 {
    font-size: 1.5em;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 5px;
}
h2 {
    font-size: 1em;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 4px;
}

</style>
