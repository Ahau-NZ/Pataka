<template>
  <Dialog :show="show" :title="title" @close="close" width="720px" :goBack="close" enableMenu>
    <!-- Content Slot -->
    <template v-slot:content>
      <v-col class="py-0" style="color:black">
        <p>
          In order for others to connect to this Pātaka over the Internet you'll need to enable
          <a
            href="https://en.wikipedia.org/wiki/Port_forwarding"
            target="_blank"
          >Port-Forwarding</a> on your router.
        </p>
        <p>Bellow is the public IP we detected. Please enable Port-Fowarding and confirm this is the right IP to connect via the internet</p>
        <p>Alternatively you can also connect locally without the internet via wifi. If you want to do this then please select use local network</p>
        <v-row class="py-4">
          <v-col cols=6>
            <v-text-field
              v-model="ip"
              :error-messages="errorMsg"
              label="This machines public IP"
              outlined
            />
          </v-col>
          <v-col class="mt-4">
            <v-btn
              @click="checkPortForwarding"
              color="black"
              class="white--text"
            >{{checkingPort ? 'Checking' : 'Check Port-Fowarding'}}
            </v-btn>
          </v-col>
        </v-row>
          <p class="overline">Select number of uses</p>
          <v-select
            :items="['single use','100 uses', '1,000 uses', '100,000 uses']"
            v-model="value"
            outlined
            style="max-width:200px"
            placeholder="single use"
            persistent-placeholder
            autofocus
          ></v-select>
      </v-col>

    </template>
    <!-- End Content Slot -->

    <!-- Actions Slot -->
    <template v-slot:actions>
      <v-btn @click="submit('local')" text large class="primary--text my-2">Use local network</v-btn>
      <v-btn @click="submit('portforward')" text large class="secondary--text my-2">Use internet network</v-btn>

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
    portFowarding: { type: Boolean, default: false },
    checkPortForwarding: { type: Function },
    checkingPort: { type: Boolean, default: false },
    errorMsg: { type: String }
  },
  data () {
    return {
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
    submit (type) {
      var Ip = (type === 'local' ? null : this.externalIp || this.publicIpv4)
      this.$emit('generate', { ip: Ip, uses: this.uses })
      this.close()
    },
    // submit (type) {

    //   const ip = type === 'local' ? null : this.externalIp || this.publicIpv4
    //   this.$emit('generate', {ip, value: this.value})
    //   this.close()
    // },
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
