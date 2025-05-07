<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
      Pomodoro Timer
    </h1>
    
    <!-- Timer Tabs -->
    <div class="w-full max-w-md mb-8">
      <div class="flex rounded-lg overflow-hidden border border-gray-700 mb-6">
        <button 
          v-for="mode in modes" 
          :key="mode.name"
          @click="setCurrentMode(mode)"
          :class="[
            'flex-1 py-3 px-4 transition-colors duration-300',
            currentMode.name === mode.name 
              ? 'bg-gray-800 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]' 
              : 'bg-gray-800/50 hover:bg-gray-800/80'
          ]"
        >
          {{ mode.name }}
        </button>
      </div>
      
      <!-- Timer Display -->
      <div class="text-center mb-6">
        <div class="text-7xl font-mono mb-4 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]">
          {{ formatTime }}
        </div>
        
        <div class="flex justify-center gap-4">
          <button 
            @click="toggleTimer" 
            class="px-6 py-2 rounded-lg bg-gray-800 border border-pink-500 hover:bg-gray-700 transition-colors duration-300 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          >
            {{ isRunning ? 'Pause' : 'Start' }}
          </button>
          <button 
            @click="resetTimer" 
            class="px-6 py-2 rounded-lg bg-gray-800 border border-purple-500 hover:bg-gray-700 transition-colors duration-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
    
    <!-- Notification Banner -->
    <div 
      v-if="showNotification" 
      class="w-full max-w-md mb-6 p-4 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500 animate-pulse"
    >
      <div class="flex items-center justify-between">
        <p class="font-medium">{{ notificationMessage }}</p>
        <button @click="showNotification = false" class="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Task List -->
    <div class="w-full max-w-md bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-purple-400">Tasks</h2>
        <button 
          v-if="tasks.length > 0" 
          @click="clearAllTasks" 
          class="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <!-- Add Task Form -->
      <div class="flex mb-4">
        <input 
          v-model="newTask" 
          @keyup.enter="addTask"
          placeholder="Add a new task..." 
          class="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button 
          @click="addTask" 
          class="bg-pink-500 hover:bg-pink-600 px-4 rounded-r-lg transition-colors duration-300"
        >
          Add
        </button>
      </div>
      
      <!-- Task List -->
      <div v-if="tasks.length > 0" class="space-y-2">
        <div 
          v-for="(task, index) in tasks" 
          :key="index"
          class="flex items-center bg-gray-700/50 rounded-lg p-3 group"
        >
          <input 
            type="checkbox" 
            v-model="task.completed" 
            class="mr-3 h-5 w-5 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
          />
          <span 
            v-if="!task.editing" 
            :class="['flex-1', task.completed ? 'line-through text-gray-400' : '']"
            @dblclick="startEditing(index)"
          >
            {{ task.text }}
          </span>
          <input 
            v-else
            v-model="task.text" 
            @blur="finishEditing(index)"
            @keyup.enter="finishEditing(index)"
            class="flex-1 bg-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500"
            ref="editInput"
          />
          <button 
            @click="removeTask(index)" 
            class="ml-2 text-gray-400 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-4 text-gray-400">
        No tasks yet. Add one to get started!
      </div>
    </div>
    
    <!-- Sound Effects -->
    <audio ref="completeSound" preload="auto">
      <source :src="completeSoundUrl" type="audio/mp3">
      Your browser does not support the audio element.
    </audio>
    
    <!-- Settings Panel -->
    <div class="mt-8 w-full max-w-md">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-xl font-semibold text-purple-400">Settings</h2>
        <div class="text-xs text-gray-400" v-if="lastSaved">
          Last saved: {{ formatLastSaved }}
        </div>
      </div>
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="soundEnabled" 
              class="mr-2 h-4 w-4 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
            />
            <span>Sound Notifications</span>
          </label>
          <button 
            @click="testSound" 
            class="text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Test Sound
          </button>
        </div>
        <div class="mt-2">
          <label class="block text-sm text-gray-400 mb-1">Sound Volume</label>
          <input 
            type="range" 
            v-model="volume" 
            min="0" 
            max="1" 
            step="0.1" 
            class="w-full accent-pink-500"
          />
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              v-model="autoSaveEnabled" 
              class="mr-2 h-4 w-4 rounded border-gray-600 text-pink-500 focus:ring-pink-500"
            />
            <span>Auto-save progress</span>
          </label>
          <p class="text-xs text-gray-400 mt-1">
            Your tasks and timer state will be saved automatically.
          </p>
          <div class="flex justify-between mt-3">
            <button 
              @click="saveToLocalStorage" 
              class="text-sm px-3 py-1 rounded bg-purple-500/30 hover:bg-purple-500/50 transition-colors"
            >
              Save Now
            </button>
            <button 
              @click="clearLocalStorage" 
              class="text-sm px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
            >
              Clear Saved Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, nextTick, watch, onMounted } from 'vue';

// Timer modes
const modes = [
  { name: 'Pomodoro', duration: 25 * 60 },
  { name: 'Short Break', duration: 5 * 60 },
  { name: 'Long Break', duration: 15 * 60 }
];

// State variables
const currentMode = ref(modes[0]);
const timeRemaining = ref(currentMode.value.duration);
const isRunning = ref(false);
const timerInterval = ref(null);

// Task management
const tasks = ref([]);
const newTask = ref('');
const editInput = ref(null);

// Sound notification
const completeSound = ref(null);
const soundEnabled = ref(true);
const volume = ref(0.7);
const showNotification = ref(false);
const notificationMessage = ref('');

// Local storage
const autoSaveEnabled = ref(true);
const lastSaved = ref(null);
const saveDebounceTimeout = ref(null);
const STORAGE_KEY = 'pomodoro-timer-state';

// Sound URL - in a real app, you would host this file or use a library
const completeSoundUrl = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

// Format the last saved time
const formatLastSaved = computed(() => {
  if (!lastSaved.value) return '';
  
  const date = new Date(lastSaved.value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Timer functions
const setCurrentMode = (mode) => {
  currentMode.value = mode;
  resetTimer();
  saveToLocalStorage();
};

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval.value);
  } else {
    timerInterval.value = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
        // Save state periodically (every 30 seconds) when timer is running
        if (timeRemaining.value % 30 === 0 && autoSaveEnabled.value) {
          saveToLocalStorage();
        }
      } else {
        clearInterval(timerInterval.value);
        isRunning.value = false;
        timerCompleted();
      }
    }, 1000);
  }
  isRunning.value = !isRunning.value;
  saveToLocalStorage();
};

const resetTimer = () => {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  timeRemaining.value = currentMode.value.duration;
  saveToLocalStorage();
};

const timerCompleted = () => {
  // Play sound notification
  if (soundEnabled.value) {
    playSound();
  }
  
  // Show visual notification
  notificationMessage.value = `${currentMode.value.name} completed!`;
  showNotification.value = true;
  
  // Auto-hide notification after 5 seconds
  setTimeout(() => {
    showNotification.value = false;
  }, 5000);
  
  // Save state after timer completes
  saveToLocalStorage();
};

const playSound = () => {
  if (completeSound.value) {
    completeSound.value.volume = volume.value;
    completeSound.value.currentTime = 0;
    completeSound.value.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
};

const testSound = () => {
  if (soundEnabled.value) {
    playSound();
  }
};

// Format time as MM:SS
const formatTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Task functions
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false,
      editing: false
    });
    newTask.value = '';
    saveToLocalStorage();
  }
};

const removeTask = (index) => {
  tasks.value.splice(index, 1);
  saveToLocalStorage();
};

const clearAllTasks = () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks.value = [];
    saveToLocalStorage();
  }
};

const startEditing = (index) => {
  // First set all tasks to not editing
  tasks.value.forEach(task => task.editing = false);
  
  // Then set the selected task to editing
  tasks.value[index].editing = true;
  
  // Focus the input on the next DOM update
  nextTick(() => {
    if (editInput.value) {
      if (Array.isArray(editInput.value)) {
        editInput.value[0]?.focus();
      } else {
        editInput.value.focus();
      }
    }
  });
};

const finishEditing = (index) => {
  tasks.value[index].editing = false;
  // Remove task if empty after editing
  if (!tasks.value[index].text.trim()) {
    removeTask(index);
  } else {
    saveToLocalStorage();
  }
};

// Local Storage functions
const saveToLocalStorage = () => {
  // Clear any existing debounce timeout
  if (saveDebounceTimeout.value) {
    clearTimeout(saveDebounceTimeout.value);
  }
  
  // Debounce the save operation to prevent too many writes
  saveDebounceTimeout.value = setTimeout(() => {
    try {
      // Create a clean tasks array without the editing flag
      const cleanTasks = tasks.value.map(task => ({
        text: task.text,
        completed: task.completed
      }));
      
      // Create the state object
      const state = {
        currentModeName: currentMode.value.name,
        timeRemaining: timeRemaining.value,
        isRunning: isRunning.value,
        tasks: cleanTasks,
        soundEnabled: soundEnabled.value,
        volume: volume.value,
        autoSaveEnabled: autoSaveEnabled.value,
        timestamp: Date.now()
      };
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSaved.value = Date.now();
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, 300); // 300ms debounce
};

const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    if (savedState) {
      const state = JSON.parse(savedState);
      
      // Validate timestamp (optional: could add expiration logic here)
      if (state.timestamp) {
        lastSaved.value = state.timestamp;
      }
      
      // Restore settings
      soundEnabled.value = state.soundEnabled ?? true;
      volume.value = state.volume ?? 0.7;
      autoSaveEnabled.value = state.autoSaveEnabled ?? true;
      
      // Restore tasks
      if (Array.isArray(state.tasks)) {
        tasks.value = state.tasks.map(task => ({
          ...task,
          editing: false // Always initialize as not editing
        }));
      }
      
      // Restore timer state
      if (state.currentModeName) {
        const foundMode = modes.find(mode => mode.name === state.currentModeName);
        if (foundMode) {
          currentMode.value = foundMode;
        }
      }
      
      if (typeof state.timeRemaining === 'number') {
        timeRemaining.value = state.timeRemaining;
      } else {
        timeRemaining.value = currentMode.value.duration;
      }
      
      // Don't automatically restart the timer, just restore the state
      isRunning.value = false;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // If there's an error, use default values
    resetToDefaults();
  }
};

const clearLocalStorage = () => {
  if (confirm('Are you sure you want to clear all saved data? This will reset the timer and remove all tasks.')) {
    localStorage.removeItem(STORAGE_KEY);
    resetToDefaults();
  }
};

const resetToDefaults = () => {
  currentMode.value = modes[0];
  timeRemaining.value = currentMode.value.duration;
  isRunning.value = false;
  tasks.value = [];
  soundEnabled.value = true;
  volume.value = 0.7;
  autoSaveEnabled.value = true;
  lastSaved.value = null;
};

// Watch for changes to save automatically
watch([tasks, soundEnabled, volume, autoSaveEnabled], () => {
  if (autoSaveEnabled.value) {
    saveToLocalStorage();
  }
}, { deep: true });

// Lifecycle hooks
onMounted(() => {
  // Load saved state when component mounts
  loadFromLocalStorage();
  
  // Set up beforeunload event to save state when user leaves
  window.addEventListener('beforeunload', () => {
    if (autoSaveEnabled.value) {
      saveToLocalStorage();
    }
  });
});

onBeforeUnmount(() => {
  // Clean up interval on component unmount
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  
  // Save state before unmounting if auto-save is enabled
  if (autoSaveEnabled.value) {
    saveToLocalStorage();
  }
  
  // Remove event listener
  window.removeEventListener('beforeunload', () => {});
});
</script>

<style>
/* Additional styles for animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>