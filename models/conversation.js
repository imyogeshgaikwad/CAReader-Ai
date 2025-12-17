const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous conversations
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
conversationSchema.index({ sessionId: 1, createdAt: -1 });
conversationSchema.index({ user: 1, createdAt: -1 });

// Method to add a message
conversationSchema.methods.addMessage = function(role, content) {
  this.messages.push({ role, content, timestamp: new Date() });
  return this.save();
};

// Method to get recent messages
conversationSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit);
};

// Static method to find or create conversation
conversationSchema.statics.findOrCreate = async function(sessionId, userId = null) {
  let conversation = await this.findOne({ sessionId, isActive: true });
  
  if (!conversation) {
    conversation = await this.create({
      sessionId,
      user: userId,
      messages: []
    });
  }
  
  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);