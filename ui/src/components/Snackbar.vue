<template>
  <v-snackbar
    v-model="showSnackbar"
    timeout="2000"
    outlined
    color="success"
  >
    {{ message }}
    <template v-slot:action="{ attrs }">
        <v-btn
          color="success"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <b>Close</b>
        </v-btn>
      </template>
  </v-snackbar>
</template>
<script>

export default {
  name: 'snackbar',
  props: {
    show: Boolean,
    message: String
  },
  computed: {
    showSnackbar: {
      get () {
        return this.show
      },
      set (bool) {
        if (bool === false) this.$emit('clearSnackbar')
      }
    }
  }
}
</script>
