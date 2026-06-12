import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Camera,
  CircuitBoard,
  FlaskConical,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Utensils,
} from 'lucide-react';
import { Badge, Button, Card, Navbar } from '../components/ui';

const stats = [
  { icon: TrendingUp, label: '68M tonnes of food wasted in India yearly' },
  { icon: CircuitBoard, label: 'Third largest e-waste generator globally' },
  { icon: BadgeCheck, label: 'Free for every Indian household' },
];

const steps = [
  {
    icon: Camera,
    title: 'Scan your item',
    text: 'Upload a photo or describe expired food, packaging, food scraps, or an old device.',
  },
  {
    icon: Boxes,
    title: 'Every part is separated',
    text: 'WasteWise breaks the item into components, then checks safety and usefulness for each part.',
  },
  {
    icon: Sparkles,
    title: 'Get a tailored action plan',
    text: 'You receive safe, location-aware suggestions with steps, sources, and clear warnings.',
  },
];

const categories = [
  { icon: Utensils, title: 'Expired food and dairy', text: 'Curd, milk, grains, oils, snacks, beverages' },
  { icon: FlaskConical, title: 'Cosmetics and skincare', text: 'Creams, oils, cleansers, masks, powders' },
  { icon: Sprout, title: 'Spices and condiments', text: 'Haldi, chilli, masalas, sauces, pickles' },
  { icon: Leaf, title: 'Food peels and scraps', text: 'Fruit peels, vegetable trimmings, seeds, rinds' },
  { icon: Recycle, title: 'Packaging and containers', text: 'Bottles, boxes, jars, cartons, tins' },
  { icon: CircuitBoard, title: 'Electronics and appliances', text: 'Phones, laptops, cables, fans, small appliances' },
];

const wisdomCards = [
  { tag: 'Ayurvedic', title: 'Expired haldi as an external paste', text: 'Topical uses are separated from unsafe consumption and shown with safety limits.' },
  { tag: 'North India', title: 'Curd hair mask pathways', text: 'Dairy is checked by age, smell, skin profile, and weather before any reuse is suggested.' },
  { tag: 'Folk remedy', title: 'Coconut oil as household polish', text: 'Traditional home uses are paired with modern safety checks and source context.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-white pt-24 soft-grid">
        <div className="absolute right-[-10%] top-16 h-80 w-80 rounded-full bg-light-purple blur-3xl" />
        <div className="absolute bottom-8 left-[-8%] h-80 w-80 rounded-full bg-light-green blur-3xl" />

        <div className="page-shell relative grid min-h-[calc(100vh-64px)] items-center gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <Badge color="green" className="mb-6">
              <Leaf size={14} /> Zero waste intelligence for India
            </Badge>
            <h1>Nothing goes to waste. Everything gets wise.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              WasteWise analyses expired products, food peels, packaging, and old electronics, then tells you exactly
              what to do with every part of them using deep research and traditional Indian knowledge.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
                Start for free <ArrowRight size={18} />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See how it works
              </Button>
            </div>

            <div className="mt-10 grid gap-3">
              {stats.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-white/80 p-3 shadow-card backdrop-blur">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-light-green text-deep-green">
                    <Icon size={19} />
                  </div>
                  <p className="font-bold text-text-secondary">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute inset-8 rounded-[32px] bg-gradient-to-br from-primary-purple to-primary-green opacity-60 blur-3xl" />
            <Card className="relative overflow-hidden border-2 border-primary-purple p-0">
              <div className="bg-gradient-to-br from-deep-purple to-deep-green p-6 text-white">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">Scan preview</p>
                    <h3 className="mt-2 text-3xl text-white">Expired curd</h3>
                  </div>
                  <Badge color="warning">2 days past date</Badge>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {['Curd solids', 'Whey', 'Container'].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/15 p-3 text-center text-xs font-bold text-white backdrop-blur">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-primary-purple bg-light-purple p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h4>Cooling face pack</h4>
                    <Badge color="purple" size="sm">Topical</Badge>
                  </div>
                  <p className="text-sm leading-6">
                    Suited for warm weather and normal skin. Patch test first, avoid broken skin, and discard if smell
                    has changed sharply.
                  </p>
                </div>
                <div className="rounded-2xl border border-primary-green bg-light-green p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h4>Garden compost booster</h4>
                    <Badge color="green" size="sm">Low risk</Badge>
                  </div>
                  <p className="text-sm leading-6">
                    Dilute whey with water and add only small amounts to compost so the pile stays balanced.
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
                  <ShieldCheck className="text-deep-green" size={22} />
                  <p className="text-sm font-bold text-text-primary">Unsafe options are blocked before results appear.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section bg-light-purple">
        <div className="page-shell">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2>How WasteWise works</h2>
            <p className="mt-4 text-base leading-7">
              Three simple steps turn a confusing waste decision into a safe, useful action plan.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <Card key={title} hoverable>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-deep-purple shadow-card">
                  <Icon size={25} />
                </div>
                <Badge color="neutral" className="mb-4">Step {index + 1}</Badge>
                <h3>{title}</h3>
                <p className="mt-3 leading-7">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section bg-white">
        <div className="page-shell">
          <div className="mb-12 max-w-2xl">
            <Badge color="purple" className="mb-4">What we handle</Badge>
            <h2>Everything in your home has a second life</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ icon: Icon, title, text }) => (
              <Card key={title} hoverable>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-light-green text-deep-green">
                  <Icon size={23} />
                </div>
                <h3>{title}</h3>
                <p className="mt-3 leading-7">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light-green">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Badge color="green" className="mb-4">Rooted in Indian wisdom</Badge>
            <h2>Traditional knowledge, checked with modern safety thinking.</h2>
            <p className="mt-5 text-base leading-8">
              WasteWise combines dadi ke nuskhe, Ayurvedic practices, regional folk remedies, and current research.
              Every useful idea is shown with its safety boundary so reuse never becomes reckless.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {wisdomCards.map((item) => (
              <Card key={item.title} hoverable>
                <Badge color="green" className="mb-4">{item.tag}</Badge>
                <h3>{item.title}</h3>
                <p className="mt-3 leading-7">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="community-proof" className="section bg-white">
        <div className="page-shell">
          <div className="grid gap-5 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['7', 'categories of waste handled'],
              ['6', 'research paths checked together'],
              ['12+', 'Indian languages supported'],
              ['100%', 'free for citizens'],
            ].map(([number, label]) => (
              <Card key={label}>
                <div className="gradient-logo text-5xl font-extrabold">{number}</div>
                <p className="mt-3 font-bold">{label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-deep-purple to-[#7B52AF] py-20 text-white">
        <div className="page-shell text-center">
          <h2 className="text-white">Start turning waste into value today</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/86">
            Join Indian households making zero go to waste with safer, smarter decisions.
          </p>
          <Button variant="white" size="lg" className="mt-8" onClick={() => navigate('/signup')}>
            Create your free account
          </Button>
        </div>
      </section>

      <footer className="bg-[#1A1A2E] py-12 text-white">
        <div className="page-shell grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="text-white">About WasteWise</h4>
            <p className="mt-3 text-sm leading-7 text-white/65">
              A zero waste companion for Indian homes, built around safety, context, and practical reuse.
            </p>
          </div>
          <div>
            <h4 className="text-white">Quick links</h4>
            <div className="mt-3 grid gap-2 text-sm font-bold text-white/65">
              <button type="button" className="w-fit hover:text-white" onClick={() => scrollTo(0, 0)}>Home</button>
              <button type="button" className="w-fit hover:text-white" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                How it works
              </button>
              <button type="button" className="w-fit hover:text-white" onClick={() => navigate('/signup')}>Get started</button>
            </div>
          </div>
          <div>
            <h4 className="text-white">Contact</h4>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Built for everyday households that want practical, safe, and culturally aware reuse.
            </p>
          </div>
        </div>
        <div className="page-shell mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
          Copyright WasteWise 2024. Nothing goes to waste. Everything gets wise.
        </div>
      </footer>
    </div>
  );
}
