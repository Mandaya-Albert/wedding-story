<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { MapPin, CalendarDays, Clock3, Copy, Music, Share2, Send, X, ChevronLeft, ChevronRight } from '@lucide/vue'
import WishSection from '~/component/wishes/WishSection.vue'

const route = useRoute()
const guestName = computed(() => String(route.query.to || 'Keluarga & Sahabat').replace(/[<>]/g,''))
const opened = ref(false)
const music = ref<HTMLAudioElement|null>(null)
const isPlaying = ref(false)
const toast = ref('')
const lightbox = ref(false)
const selectedIndex = ref(0)
const selectedImage = computed(() => gallery[selectedIndex.value])

const target = new Date('2026-12-19T09:00:00+07:00').getTime()
const remaining = ref({ days:0, hours:0, minutes:0, seconds:0 })
let timer: ReturnType<typeof setInterval>

const gallery = ['/gallery/wedding-1.jpeg','/gallery/wedding-2.jpeg','/gallery/wedding-3.jpeg','/gallery/wedding-4.jpeg','/gallery/wedding-5.jpeg','/gallery/wedding-6.jpeg','/gallery/wedding-7.jpeg','/gallery/wedding-8.jpeg','/gallery/wedding-9.jpeg','/gallery/wedding-10.jpeg']

onMounted(() => {
  document.documentElement.classList.add('invitation-opening')
  document.body.style.overflow = 'hidden'
  window.scrollTo(0, 0)


  timer = setInterval(updateCountdown,1000)
  updateCountdown()
  music.value = new Audio('/music/this-moment.mp3')
  music.value.loop = true

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible') }),{threshold:.12})
  document.querySelectorAll('.reveal, [data-aos]').forEach(el => observer.observe(el))
  window.addEventListener('keydown', handleGalleryKey)
})

onBeforeUnmount(() => {
  clearInterval(timer)
  document.documentElement.classList.remove('invitation-opening')
  document.body.style.removeProperty('overflow')
  window.removeEventListener('keydown', handleGalleryKey)
})

function updateCountdown(){
  const diff = Math.max(0,target-Date.now())
  remaining.value = {days:Math.floor(diff/86400000),hours:Math.floor(diff/3600000)%24,minutes:Math.floor(diff/60000)%60,seconds:Math.floor(diff/1000)%60}
}

async function openInvitation(){
  if (opened.value) return
  opened.value=true
  try { await music.value?.play(); isPlaying.value=true } catch {}
  setTimeout(() => {
    document.querySelector('.opening')?.classList.add('closed')
  }, 1500)
  setTimeout(() => {
    document.querySelector('.opening')?.remove()
    document.documentElement.classList.remove('invitation-opening')
    document.body.style.removeProperty('overflow')
    document.querySelector('.hero')?.scrollIntoView({behavior:'instant' as ScrollBehavior})
  }, 2300)
}

async function toggleMusic(){
  if(!music.value) return
  if(isPlaying.value){ music.value.pause(); isPlaying.value=false }
  else { await music.value.play(); isPlaying.value=true }
}

async function copyText(text:string,label:string){
  await navigator.clipboard?.writeText(text)
  showToast(`${label} berhasil disalin`)
}

function showToast(message:string){ toast.value=message; setTimeout(()=>toast.value='',2600) }

async function shareInvitation(){
  const url = new URL(window.location.href)
  url.searchParams.set('to',guestName.value)
  const data = {title:'The Wedding of Tius & Hania',text:'Kepada '+guestName.value+', kami mengundang Anda.',url:url.toString()}
  if(navigator.share) await navigator.share(data)
  else await copyText(url.toString(),'Link undangan')
}

function openGallery(index:number){
  selectedIndex.value=index
  lightbox.value=true
}

function previousImage(){
  selectedIndex.value=(selectedIndex.value-1+gallery.length)%gallery.length
}

function nextImage(){
  selectedIndex.value=(selectedIndex.value+1)%gallery.length
}

function handleGalleryKey(event:KeyboardEvent){
  if(!lightbox.value) return
  if(event.key==='ArrowLeft') previousImage()
  if(event.key==='ArrowRight') nextImage()
  if(event.key==='Escape') lightbox.value=false
}

let touchStartX=0
function handleTouchStart(event:TouchEvent){ touchStartX=event.changedTouches[0].clientX }
function handleTouchEnd(event:TouchEvent){
  const distance=event.changedTouches[0].clientX-touchStartX
  if(Math.abs(distance)<50) return
  distance>0?previousImage():nextImage()
}
</script>

<template>
  <main>
    <div class="toast" :class="{show:toast}">{{ toast }}</div>

    <section class="opening" :class="{closed:opened, opened:opened}">
      <div class="opening-bg"></div>
      <div class="envelope">
        <div class="envelope-flap"></div>
        <div class="letter">
          <p class="eyebrow">The Wedding of</p>
          <h1 class="script">Tius <span>&</span><br/>Hania</h1>
          <p style="margin-top:32px">Kepada Yth.</p>
          <p class="script" style="font-size:2.4rem;margin:8px 0 26px;color:#a51d2d">{{ guestName }}</p>
          <p style="color:#75695f">Sabtu, 19 Desember 2026</p>
        </div>
        <button class="open-btn" @click="openInvitation"><Send :size="19"/><span>Buka Undangan</span></button>
      </div>
    </section>

    <button class="music-player" :class="{playing:isPlaying, paused:!isPlaying}" :aria-label="isPlaying?'Pause music':'Play music'" @click="toggleMusic"><Music :size="20"/></button>

    <section class="hero">
      <img src="/images/hero.jpeg" alt="Tius dan Hania">
      <div class="hero-content" data-aos="zoom-in">
        <p class="eyebrow" style="color:#f3d8c8">The Wedding of</p>
        <h1><em>Timotius<br/>& Hania</em></h1>
        <p class="date-line">19 · 12 · 2026</p>
      </div>
    </section>

    <section class="couple">
      <div class="container reveal">
        <div style="text-align:center"><p class="eyebrow">The Wedding of</p><h2 class="section-title">Bride & Groom</h2></div>
        <div class="couple-grid">
          <article class="person" data-aos="fade-right"><img src="/images/timo.jpeg" alt="Tius"/>
            <h3>Timotius Ossenta Tarigan</h3>
            <!-- <p>Putra dari Bapak ... & Ibu ...</p> -->
          </article>
          <div class="and">&</div>
          <article class="person" data-aos="fade-left"><img src="/images/hania.jpeg" alt="Hania"/><h3>Hania Nathalie Aritonang </h3>
            <!-- <p>Putri dari Bapak ... & Ibu ...</p> -->
          </article>
        </div>
        <div class="verse-card reveal" data-aos="fade-up">
          <h3>Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih.</h3>
          <p>1 Korintus 13:13</p>
          <br>
          <h3>Dan diatas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.</h3>
          <p>Kolose 3:14</p>
        </div>
      </div>
    </section>

    <section class="countdown">
      <div class="container reveal">
        <p class="eyebrow" style="color:#dfb6aa">Menuju Hari Bahagia</p>
        <h2 class="section-title">19 Desember 2026</h2>
        <div class="countdown-grid">
          <div class="time"><strong>{{remaining.days}}</strong><span>Hari</span></div><div class="time"><strong>{{remaining.hours}}</strong><span>Jam</span></div><div class="time"><strong>{{remaining.minutes}}</strong><span>Menit</span></div><div class="time"><strong>{{remaining.seconds}}</strong><span>Detik</span></div>
        </div>
      </div>
    </section>

    <section class="events">
      <div class="container reveal">
        <div style="text-align:center"><p class="eyebrow">Acara</p><h2 class="section-title">Wedding Events</h2></div>
        <div class="event-grid">
          <!-- <article class="event-card" data-aos="fade-up"><CalendarDays/><h3>Akad Nikah</h3><p>Sabtu, 19 Desember 2026<br/>09.00 — 10.30 WIB</p><p><MapPin :size="16"/> Hotel Mulia, Jakarta</p><a class="map-link" target="_blank" href="https://maps.google.com/?q=Hotel+Mulia+Jakarta">Lihat Lokasi</a></article> -->
          <article class="event-card" data-aos="fade-up" style="--delay:120ms"><Clock3/><h3>Pemberkatan</h3><p>Sabtu, 19 Desember 2026<br/>09.00 — Selesai WIB</p><p><MapPin :size="16"/> GBKP SEI PADANG, MEDAN</p><a class="map-link" target="_blank" href="https://maps.app.goo.gl/DT5RNXbu6U2YtRiC9">Lihat Lokasi</a></article>
          <!-- <article class="event-card" data-aos="fade-up" style="--delay:240ms"><CalendarDays/><h3>Resepsi</h3><p>Sabtu, 19 Desember 2026<br/>18.00 — 21.00 WIB</p><p><MapPin :size="16"/> Ballroom Hotel Mulia</p><a class="map-link" target="_blank" href="https://maps.google.com/?q=Hotel+Mulia+Jakarta">Lihat Lokasi</a></article> -->
        </div>
      </div>
    </section>

    <section class="gallery">
      <div class="container reveal">
        <p class="eyebrow" style="color:#dfb6aa">Our Moments</p><h2 class="section-title">Galeri Cinta</h2>
        <div class="gallery-grid"><button v-for="(image,index) in gallery" :style="{'--delay': `${index * 100}ms`}" data-aos="zoom-in" :key="image" @click="openGallery(index)"><img :src="image" loading="lazy" alt="Galeri Tius dan Hania"/></button></div>
      </div>
    </section>

    <div v-if="lightbox" class="lightbox" @click="lightbox=false" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
      <button class="lightbox-close" aria-label="Tutup galeri" @click.stop="lightbox=false"><X :size="26"/></button>
      <button class="lightbox-nav lightbox-prev" aria-label="Foto sebelumnya" @click.stop="previousImage"><ChevronLeft :size="34"/></button>
      <img :src="selectedImage" alt="Foto diperbesar" @click.stop="() => {}"/>
      <button class="lightbox-nav lightbox-next" aria-label="Foto berikutnya" @click.stop="nextImage"><ChevronRight :size="34"/></button>
      <div class="lightbox-counter">{{ selectedIndex + 1 }} / {{ gallery.length }}</div>
    </div>

    <section class="gift">
      <div class="container reveal"><div style="text-align:center"><p class="eyebrow">Wedding Gift</p><h2 class="section-title">Amplop Digital</h2></div>
        <div class="gift-grid"><article class="bank-card" data-aos="fade-right"><div><small>Bank BCA</small><strong>0220550770</strong><span>Timotius Ossenta Tarigan</span></div><button class="copy-btn" @click="copyText('0220550770','Nomor rekening')"><Copy :size="16"/>Salin</button></article><article class="bank-card" data-aos="fade-left"><div><small>Bank Mandiri</small><strong>1060022494440</strong><span>HANIA NATHALIE ARITONANG</span></div><button class="copy-btn" @click="copyText('1650003185791','Nomor rekening')"><Copy :size="16"/>Salin</button></article></div>
      </div>
    </section>

    <section class="wishes">
      <div class="container reveal">
        <WishSection @sent="showToast" @error="showToast" />
      </div>
    </section>

    <footer class="footer"><p class="script" style="font-size:2.2rem">Tius & Hania</p><p>Merupakan kehormatan dan kebahagiaan bagi kami.</p><button class="share-btn" @click="shareInvitation"><Share2 :size="16"/>Bagikan Undangan</button></footer>
  </main>
</template>
