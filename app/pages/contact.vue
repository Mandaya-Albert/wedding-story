<script setup lang="ts">
import { ref } from 'vue'
import { Send, ArrowLeft } from '@lucide/vue'
const name=ref('')
const phone=ref('')
function sendInvite(){
  if(!name.value.trim() || !phone.value.trim()) return
  const base=window.location.origin+'?to='+encodeURIComponent(name.value.trim())
  const text=` Salam Sejahtera\n
Dengan penuh sukacita, kami mengundang *${name.value}* untuk menghadiri pernikahan kami:\n
*Berikut link undangan kami* untuk info lengkap mengenai undangan kami, dapat mengunjungi:\n
${base}\n
Merupakan suatu kebahagian bagi kami apabila berkenan untuk hadir dan memberikan doa restu secara langsung.\n
*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*

Timotius & Hania
19 Desember 2026
`
  window.open(`https://wa.me/${phone.value.replace(/\D/g,'')}?text=${encodeURIComponent(text)}`,'_blank')
}
</script>

<template>
  <main class="contact-page"><NuxtLink to="/" class="back"><ArrowLeft :size="18"/>Undangan</NuxtLink><div class="contact-card"><p class="eyebrow">Personal Invitation</p><h1>Buat Undangan</h1><p class="lead">Masukkan nama dan nomor WhatsApp tamu untuk membuat tautan undangan pribadi.</p><form @submit.prevent="sendInvite"><label>Nama Tamu<input v-model="name" placeholder="Contoh: Andika" required/></label><label>Nomor WhatsApp<input v-model="phone" inputmode="tel" placeholder="628123456789" required/></label><button type="submit"><Send :size="18"/>Kirim via WhatsApp</button></form></div></main>
</template>

<style scoped>
.contact-page{min-height:100vh;display:grid;place-items:center;padding:40px 20px;background:linear-gradient(145deg,#17110f,#47171c);position:relative}.back{position:absolute;top:24px;left:24px;color:white;text-decoration:none;display:flex;align-items:center;gap:8px}.contact-card{width:min(520px,100%);background:#f7f1e8;padding:44px;border-radius:8px;box-shadow:0 30px 80px #0008}.contact-card h1{font-family:'Cormorant Garamond',serif;font-size:3.5rem;margin:.1em 0}.lead{color:#71675e}.contact-card form{display:grid;gap:18px;margin-top:28px}.contact-card label{display:grid;gap:8px;font-weight:600;font-size:.85rem}.contact-card input{border:1px solid #cdbfae;background:white;padding:15px;outline:none}.contact-card input:focus{border-color:#a51d2d}.contact-card button{border:0;border-radius:6px;background:#a51d2d;color:white;padding:16px;display:flex;justify-content:center;gap:8px;cursor:pointer}@media(max-width:767px){.contact-card{padding:30px 22px}.contact-card h1{font-size:2.7rem}}
</style>
