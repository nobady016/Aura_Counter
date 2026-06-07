import { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  Sparkles, Skull, Droplet, Meh, Flame, Crown,
  Plus, Minus, Download, TrendingUp, TrendingDown,
  Trash2, Send, User, Star, Zap, Heart
} from 'lucide-react';

interface AuraEvent {
  id: string;
  text: string;
  points: number;
  isGain: boolean;
  isCustom?: boolean;
}

const PRESET_SCENARIOS: AuraEvent[] = [
  { id: '1', text: 'Held the door open for someone', points: 50, isGain: true },
  { id: '2', text: 'Left on read by crush', points: -200, isGain: false },
  { id: '3', text: 'Maintained 100+ days Duolingo streak', points: 300, isGain: true },
  { id: '4', text: 'Stumbled walking and blamed the floor', points: -150, isGain: false },
  { id: '5', text: 'Successfully made the cashier laugh', points: 100, isGain: true },
  { id: '6', text: 'Said "You too" when waiter said "Enjoy your food"', points: -500, isGain: false },
  { id: '7', text: 'Wore sunglasses indoors unironically', points: -250, isGain: false },
  { id: '8', text: 'Got complimented on outfit by a stranger', points: 400, isGain: true },
  { id: '9', text: 'Sent a text to the wrong person', points: -300, isGain: false },
  { id: '10', text: 'Helped someone carry groceries', points: 150, isGain: true },
  { id: '11', text: 'Forgot what you walked into a room for', points: -100, isGain: false },
  { id: '12', text: 'Remembered someone\'s name after one meeting', points: 200, isGain: true },
  { id: '13', text: 'Tripped up the stairs in public', points: -350, isGain: false },
  { id: '14', text: 'Gave a genuinely great speech', points: 500, isGain: true },
  { id: '15', text: 'Walked into a glass door', points: -400, isGain: false },
  { id: '16', text: 'Paid for someone\'s coffee randomly', points: 350, isGain: true },
];

interface RankInfo {
  title: string;
  emoji: string;
  color: string;
  glowColor: string;
}

function getRank(score: number): RankInfo {
  if (score < -500) return { title: 'Absolute Menace / Certified NPC', emoji: '\uD83D\uDC80', color: 'text-red-400', glowColor: 'shadow-red-500/30' };
  if (score <= 0) return { title: 'Down Bad / Cooked', emoji: '\uD83D\uDE2D', color: 'text-orange-400', glowColor: 'shadow-orange-500/30' };
  if (score <= 500) return { title: 'Casual Citizen', emoji: '\uD83D\uDE10', color: 'text-yellow-400', glowColor: 'shadow-yellow-500/30' };
  if (score <= 1500) return { title: 'Rizzler in Training', emoji: '\uD83D\uDE0F', color: 'text-cyan-400', glowColor: 'shadow-cyan-500/30' };
  return { title: 'GigaChad / Infinite Rizz Sigma', emoji: '\uD83D\uDDFC', color: 'text-emerald-400', glowColor: 'shadow-emerald-500/30' };
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue === value) return;
    setIsAnimating(true);
    const diff = value - displayValue;
    const steps = Math.min(Math.abs(diff), 20);
    const stepValue = diff / steps;
    let current = displayValue;
    const interval = setInterval(() => {
      current += stepValue;
      if ((stepValue > 0 && current >= value) || (stepValue < 0 && current <= value)) {
        current = value;
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 150);
      }
      setDisplayValue(Math.round(current));
    }, 30);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className={`inline-block transition-transform duration-150 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
      {displayValue >= 0 ? `+${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
    </span>
  );
}

function AuraCard({
  cardRef,
  username,
  score,
  rank,
}: {
  cardRef: React.RefObject<HTMLDivElement>;
  username: string;
  score: number;
  rank: RankInfo;
}) {
  return (
    <div
      ref={cardRef}
      className="w-[360px] h-[480px] rounded-3xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0e3a 30%, #0d1b2a 70%, #0a0e1a 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-between h-full p-8">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          <span className="text-white/60 text-xs tracking-[0.3em] uppercase font-medium">Aura Points</span>
          <Zap className="w-5 h-5 text-violet-400" />
        </div>

        {/* Emoji & Score */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl">{rank.emoji}</span>
          <span className={`text-5xl font-bold tracking-tight ${score >= 0 ? 'text-cyan-300' : 'text-red-400'}`}
            style={{ textShadow: score >= 0 ? '0 0 20px rgba(34,211,238,0.4)' : '0 0 20px rgba(248,113,113,0.4)' }}>
            {score >= 0 ? '+' : ''}{score.toLocaleString()}
          </span>
        </div>

        {/* Rank title */}
        <div className="text-center">
          <p className={`${rank.color} text-lg font-semibold tracking-wide`}>{rank.title}</p>
        </div>

        {/* Username */}
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 border border-white/10">
          <User className="w-4 h-4 text-white/50" />
          <span className="text-white/80 text-sm font-medium">{username || 'Anonymous'}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-white/30 text-[10px] tracking-wider uppercase">
          <Sparkles className="w-3 h-3" />
          <span>aura-counter.app</span>
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState('');
  const [customText, setCustomText] = useState('');
  const [customPoints, setCustomPoints] = useState('');
  const [customIsGain, setCustomIsGain] = useState(true);
  const [customEvents, setCustomEvents] = useState<AuraEvent[]>([]);
  const [popScore, setPopScore] = useState(false);
  const [recentChange, setRecentChange] = useState<{ amount: number; isGain: boolean } | null>(null);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  const rank = getRank(score);

  const handleClick = useCallback((event: AuraEvent) => {
    setScore(prev => prev + event.points);
    setPopScore(true);
    setRecentChange({ amount: Math.abs(event.points), isGain: event.isGain });
    setTimeout(() => setPopScore(false), 300);
    setTimeout(() => setRecentChange(null), 1200);
  }, []);

  const handleAddCustom = useCallback(() => {
    const pts = parseInt(customPoints);
    if (!customText.trim() || isNaN(pts) || pts <= 0) return;
    const ev: AuraEvent = {
      id: `custom-${Date.now()}`,
      text: customText.trim(),
      points: customIsGain ? pts : -pts,
      isGain: customIsGain,
      isCustom: true,
    };
    setCustomEvents(prev => [ev, ...prev]);
    setCustomText('');
    setCustomPoints('');
  }, [customText, customPoints, customIsGain]);

  const handleRemoveCustom = useCallback((id: string) => {
    setCustomEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `aura-card-${username || 'anonymous'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [username]);

  const allEvents = [...customEvents, ...PRESET_SCENARIOS];
  const gains = allEvents.filter(e => e.isGain);
  const losses = allEvents.filter(e => !e.isGain);

  const getScoreBarWidth = () => {
    const maxDisplay = 2000;
    const normalized = Math.max(-maxDisplay, Math.min(maxDisplay, score));
    return Math.abs(normalized) / maxDisplay * 100;
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 40%, #020617 100%)' }}>

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-fuchsia-600/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-20 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h1 className="text-lg font-bold text-white tracking-wide">Aura Counter</h1>
          </div>
          <button
            onClick={() => setShowUsernameInput(!showUsernameInput)}
            className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 text-xs"
          >
            <User className="w-3.5 h-3.5" />
            {username || 'Set Name'}
          </button>
        </div>

        {/* Username input */}
        {showUsernameInput && (
          <div className="glass rounded-2xl p-4 animate-slide-up">
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-400/50 transition-all text-sm"
              maxLength={20}
              autoFocus
            />
          </div>
        )}

        {/* Score Display */}
        <div className="glass-strong rounded-3xl p-6 text-center neon-border animate-glow-pulse">
          <p className="text-white/40 text-xs tracking-[0.25em] uppercase mb-2">Your Aura Score</p>
          <div className="relative">
            <h2
              className={`text-5xl font-bold tracking-tight transition-all duration-300 ${popScore ? 'scale-110' : 'scale-100'} ${score >= 0 ? 'text-cyan-300 neon-cyan' : 'text-red-400'}`}
              style={{ textShadow: score >= 0 ? '0 0 20px rgba(34,211,238,0.4)' : '0 0 20px rgba(248,113,113,0.4)' }}
            >
              <AnimatedNumber value={score} />
            </h2>
            {/* Floating change indicator */}
            {recentChange && (
              <span
                className={`absolute -top-4 right-1/2 translate-x-1/2 text-sm font-bold animate-slide-up ${recentChange.isGain ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {recentChange.isGain ? '+' : '-'}{recentChange.amount}
              </span>
            )}
          </div>

          {/* Score bar */}
          <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${score >= 0 ? 'bg-gradient-to-r from-cyan-500 to-violet-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
              style={{ width: `${getScoreBarWidth()}%`, marginLeft: score < 0 ? 'auto' : '0' }}
            />
          </div>
        </div>

        {/* Rank Badge */}
        <div className={`glass rounded-2xl p-4 text-center transition-all duration-500 shadow-lg ${rank.glowColor}`}>
          <span className="text-3xl block mb-1">{rank.emoji}</span>
          <p className={`${rank.color} font-semibold text-sm tracking-wide`}>{rank.title}</p>
        </div>

        {/* Aura Gain Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-emerald-400 text-sm font-semibold tracking-wide">Aura Gain</h3>
          </div>
          <div className="space-y-1.5">
            {gains.map((event) => (
              <button
                key={event.id}
                onClick={() => handleClick(event)}
                className="w-full glass rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-emerald-500/15 hover:border-emerald-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-white/80 text-sm text-left flex-1 mr-3">{event.text}</span>
                <span className="text-emerald-400 font-bold text-sm whitespace-nowrap flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />{event.points}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aura Loss Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <h3 className="text-red-400 text-sm font-semibold tracking-wide">Aura Loss</h3>
          </div>
          <div className="space-y-1.5">
            {losses.map((event) => (
              <button
                key={event.id}
                onClick={() => handleClick(event)}
                className="w-full glass rounded-xl px-4 py-3 flex items-center justify-between group hover:bg-red-500/15 hover:border-red-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-white/80 text-sm text-left flex-1 mr-3">{event.text}</span>
                <div className="flex items-center gap-1">
                  <span className="text-red-400 font-bold text-sm whitespace-nowrap flex items-center gap-1">
                    <Minus className="w-3.5 h-3.5" />{Math.abs(event.points)}
                  </span>
                  {event.isCustom && (
                    <button
                      onClick={e => { e.stopPropagation(); handleRemoveCustom(event.id); }}
                      className="ml-2 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Aura Input */}
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-violet-400" />
            <h3 className="text-violet-400 text-sm font-semibold tracking-wide">Custom Aura Event</h3>
          </div>
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="What happened..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-400/50 transition-all text-sm"
            maxLength={80}
          />
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={customPoints}
                onChange={e => setCustomPoints(e.target.value)}
                placeholder="Points"
                min={1}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-400/50 transition-all text-sm pr-10"
              />
            </div>
            <button
              onClick={() => setCustomIsGain(!customIsGain)}
              className={`rounded-xl px-4 py-2.5 font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 ${customIsGain ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'}`}
            >
              {customIsGain ? <><Plus className="w-4 h-4" /> Gain</> : <><Minus className="w-4 h-4" /> Loss</>}
            </button>
          </div>
          <button
            onClick={handleAddCustom}
            disabled={!customText.trim() || !customPoints || parseInt(customPoints) <= 0}
            className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" /> Add Event
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => { setScore(0); setCustomEvents([]); }}
          className="w-full glass rounded-xl px-4 py-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 text-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Reset All
        </button>

        {/* Share Card Toggle */}
        <button
          onClick={() => setShowCard(!showCard)}
          className="w-full glass rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300 group"
        >
          <div className="flex items-center justify-center gap-2 text-white/70 group-hover:text-cyan-400 transition-colors">
            <Crown className="w-5 h-5" />
            <span className="font-semibold text-sm">{showCard ? 'Hide' : 'Generate'} Aura ID Card</span>
            <Crown className="w-5 h-5" />
          </div>
        </button>

        {/* Aura ID Card */}
        {showCard && (
          <div className="animate-slide-up space-y-4">
            <div className="flex justify-center">
              <AuraCard
                cardRef={cardRef}
                username={username}
                score={score}
                rank={rank}
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl py-3 transition-all duration-300 flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Download Share Card
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-white/20 text-xs flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" /> built with aura <Heart className="w-3 h-3" />
          </p>
        </div>
      </div>
    </div>
  );
}
