# Tavus Documentation Index

Central hub for all Tavus Conversational Video Interface (CVI) documentation.

---

## 📚 Quick Navigation

### **Getting Started**
- [Main Integration Guide](./TAVUS.md) - Start here for setup and configuration
- [API Reference](./TAVUS_API_REFERENCE.md) - Complete API documentation

### **Configuration & Updates**
- [Config Update Guide](./TAVUS_CONFIG_UPDATE_GUIDE.md) - How to update objectives and guardrails
- [Dynamic Sync](./TAVUS_DYNAMIC_SYNC_COMPLETE.md) - Automated config sync implementation

### **Feature Implementation**
- [Objective Completion Tracking](./TAVUS_OBJECTIVE_COMPLETION_TRACKING.md) - Track learner assessment progress
- [Time Limit & Tracking](./TAVUS_TIME_LIMIT_AND_TRACKING_UPDATE.md) - 3-minute time limit implementation
- [Learning Check Implementation](./TAVUS_IMPLEMENTATION_COMPLETE.md) - Complete learning check feature

### **Code References**
- **Config**: `src/lib/tavus/config.ts` - All Tavus configurations
- **API Routes**: `src/app/api/learning-checks/` - Conversation, objectives, guardrails endpoints
- **Components**: `src/components/course/chapter-content/learning-check-base.tsx` - Main learning check component
- **Scripts**: `scripts/update-tavus-*.sh` - Update scripts for config sync

---

## 📖 Document Purposes

### **TAVUS.md**
**Purpose**: Main integration guide  
**Use When**: Initial setup, understanding architecture  
**Covers**: Setup, configuration, persona creation, troubleshooting

### **TAVUS_API_REFERENCE.md**
**Purpose**: Complete API documentation  
**Use When**: Making API calls, understanding endpoints  
**Covers**: All Tavus API endpoints with examples

### **TAVUS_CONFIG_UPDATE_GUIDE.md**
**Purpose**: User guide for config updates  
**Use When**: Updating objectives or guardrails  
**Covers**: Step-by-step update process, troubleshooting

### **TAVUS_DYNAMIC_SYNC_COMPLETE.md**
**Purpose**: Implementation summary of dynamic config sync  
**Use When**: Understanding how config sync works  
**Covers**: Technical implementation, scripts, workflow

### **TAVUS_OBJECTIVE_COMPLETION_TRACKING.md**
**Purpose**: Technical guide for tracking objective completion  
**Use When**: Implementing webhook handling for objectives  
**Covers**: Webhook setup, data structures, implementation examples

### **TAVUS_TIME_LIMIT_AND_TRACKING_UPDATE.md**
**Purpose**: Summary of time limit and tracking implementation  
**Use When**: Understanding conversation time limits  
**Covers**: Time limit enforcement, objective tracking integration

### **TAVUS_IMPLEMENTATION_COMPLETE.md**
**Purpose**: Complete learning check feature documentation  
**Use When**: Understanding full learning check implementation  
**Covers**: Complete feature overview, architecture, components

---

## 🎯 Common Tasks

### **Update Objectives or Guardrails**
1. Edit `src/lib/tavus/config.ts`
2. Run `./scripts/update-tavus-config.sh`
3. Reference: [Config Update Guide](./TAVUS_CONFIG_UPDATE_GUIDE.md)

### **Create a Learning Check Conversation**
1. Use API route: `POST /api/learning-checks/conversation`
2. Reference: [API Reference](./TAVUS_API_REFERENCE.md)

### **Track Objective Completion**
1. Set up webhook endpoint
2. Handle `application.transcription_ready` event
3. Reference: [Objective Tracking Guide](./TAVUS_OBJECTIVE_COMPLETION_TRACKING.md)

### **Troubleshoot Connection Issues**
1. Check environment variables
2. Verify API key and IDs
3. Reference: [Main Guide Troubleshooting](./TAVUS.md#troubleshooting)

---

## 🗂️ Archive

Historical documentation from previous implementations:
- `docs/archive/HAIRCHECK_CONVERSATION_FIX.md` - Hair check flow fix (completed)
- `docs/archive/LEARNING_CHECK_BASE_ANALYSIS.md` - Component analysis (completed)

---

## 🔄 Maintenance

**When adding new Tavus documentation**:
1. Create the doc in `/docs/`
2. Add it to this index under appropriate section
3. Include purpose and use cases
4. Update common tasks if applicable

**When archiving old documentation**:
1. Move to `/docs/archive/`
2. Update this index to reference archive location
3. Note completion date

---

**Last Updated**: October 31, 2025
