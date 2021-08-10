<template>
  <Dialog :show="show" :title="title" @close="close" width="720px" :goBack="close" enableMenu>
    <!-- Content Slot -->
    <template v-slot:content>
      <v-col class="py-0" style="color:black">
        <v-row>
          <v-col cols=6>
            <v-text-field
              v-model="ip"
              :error-messages="errorMsg"
              label="This machines public IP"
              outlined
            />
          </v-col>
          <v-col class="mt-4">
            <v-row justify="start" align="center" class="py-2">
              <div
                class="dot mr-4"
                :class="portForwarding ? 'green' : 'orange'"
              />
              <p class="caption text-uppercase text-center ma-0" >
                {{ portForwarding ? 'Port-Forwarding' :portForwarding === null ? 'Checking' : 'Port-Forwarding Off' }}
              </p>
            </v-row>
          </v-col>
        </v-row>
        <div v-if="!portForwarding">
          <p>Our portfordward checks indicate that you have not setup portforwarding.</p>
          <p>
            In order for others to connect to this Pātaka over the Internet you'll need to enable
            <a
              href="https://en.wikipedia.org/wiki/Port_forwarding"
              target="_blank"
            >Port-Forwarding</a> on your router.
          </p>
          <p>Depending on your router, our portfordwarding checks maybe by inaccurate. If you believe you have correctly setup port forwarding then we recommend that you test generating a code using your internet connection</p>
          <p>Alternatively you can also connect locally without the internet via wifi. If you want to do this then please select use local network</p>
        </div>
        <v-row>
          <v-col>
            <p class="overline">Select number of uses</p>
            <v-select
              :items="['single use','100 uses', '1,000 uses', '100,000 uses']"
              v-model="value"
              outlined
              style="max-width:300px"
              placeholder="single use"
              persistent-placeholder
              autofocus
            ></v-select>
          </v-col>
          <v-col>
            <p class="overline">Select connection</p>
            <v-select
              :items="['Connect globally over internet', 'Connect locally over wifi']"
              v-model="type"
              outlined
              style="max-width:300px"
              :placeholder=" portForwarding ? 'connect globally over internet' : 'connect locally over wifi'"
              persistent-placeholder
              autofocus
            ></v-select>
          </v-col>
        </v-row>
      </v-col>

    </template>
    <!-- End Content Slot -->

    <!-- Actions Slot -->
    <template v-slot:actions>
      <div>
        <v-btn @click="submit()" text large class="primary--text my-2">Generate code</v-btn>
      </div>
    </template>
    <!-- End Actions Slot -->
  </Dialog>
</template>

<script>
import Dialog from '@/components/Dialog.vue'

export default {
  name: 'GenerateInviteDialog',
  components: {
    Dialog
  },
  props: {
    show: { type: Boolean, required: true },
    title: { type: String },
    publicIpv4: { type: String, default: 'xxx.xxx.xx.xx' },
    portForwarding: { type: Boolean, default: false },
    checkPortForwarding: { type: Function },
    checkingPort: { type: Boolean, default: false },
    errorMsg: { type: String }
  },
  data () {
    return {
      type: '',
      value: '',
      externalIp: null
    }
  },
  computed: {
    ip: {
      get: function () {
        return this.externalIp || this.publicIpv4
      },
      set: function (newValue) {
        this.externalIp = newValue
      }
    },
    uses () {
      switch (this.value) {
        case 'single use': return 1
        case '100 uses': return 100
        case '1,000 uses': return 1000
        case '100,000 uses': return 100000
        default:
          return 1
      }
    }
  },
  methods: {
    submit () {
      var Ip = (this.type === 'connect locally over wifi' ? null : this.externalIp || this.publicIpv4)
      this.$emit('generate', { ip: Ip, uses: this.uses })
      this.close()
    },
    close () {
      this.$emit('close')
    }

  }
}
</script>

<style scoped>
.custom.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.custom.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.close {
  top: -25px;
  right: -10px;
}
</style>
