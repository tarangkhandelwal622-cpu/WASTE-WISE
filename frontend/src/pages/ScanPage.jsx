import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CircuitBoard,
  Leaf,
  Package,
  Recycle,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/AppLayout';
import { Button, Card, Input, PageHeader } from '../components/ui';

const scanTypes = [
  {
    id: 'expired_product',
    title: 'Expired product',
    text: 'Food, dairy, oils, spices, cosmetics, or household products.',
    icon: Package,
  },
  {
    id: 'food_peels',
    title: 'Food peels and scraps',
    text: 'Fruit peels, vegetable trimmings, seeds, rinds, or leftovers.',
    icon: Leaf,
  },
  {
    id: 'waste_packaging',
    title: 'Waste packaging',
    text: 'Glass bottles, plastic containers, cardboard, tins, cartons.',
    icon: Recycle,
  },
  {
    id: 'electronics',
    title: 'Old electronics',
    text: 'Phones, laptops, cables, appliances, screens, chargers.',
    icon: CircuitBoard,
  },
];

const options = {
  expired_product: ['Dairy', 'Oils and fats', 'Grains and flour', 'Spices', 'Cosmetics', 'Packaged food', 'Beverage', 'Other'],
  food_peels: ['Banana peel', 'Potato peel', 'Mango peel', 'Apple peel', 'Watermelon rind', 'Coconut shell', 'Mixed scraps', 'Other'],
  waste_packaging: ['Glass', 'Plastic', 'Cardboard', 'Metal', 'Fabric', 'Paper', 'Mixed material'],
  electronics: ['Mobile phone', 'Laptop', 'Tablet', 'TV or monitor', 'Kitchen appliance', 'Cable or charger', 'Audio device', 'Other'],
};

const initialForm = {
  itemName: '',
  category: '',
  expiryDate: '',
  expiryType: 'best_before',
  quantity: '',
  ingredients: '',
  condition: '',
  notes: '',
  materialType: '',
  size: '',
  hasResidue: false,
  brand: '',
  age: '',
  issue: '',
};

export default function ScanPage() {
  const [scanType, setScanType] = useState('');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const selectedType = scanTypes.find((type) => type.id === scanType);
  const Icon = selectedType?.icon || Camera;

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const chooseType = (type) => {
    setScanType(type);
    setForm(initialForm);
  };

  const validate = () => {
    if (!scanType) return 'Choose what you are scanning';
    if (scanType === 'electronics') {
      if (!form.category) return 'Choose the device category';
      if (!form.condition) return 'Choose device condition';
      return '';
    }
    if (!form.itemName.trim() && !form.category) return 'Add an item name or category';
    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      navigate('/processing', {
        state: {
          scanType,
          itemName: form.itemName || form.category || 'your item',
          form,
        },
      });
      setLoading(false);
    }, 450);
  };

  if (!scanType) {
    return (
      <AppLayout>
        <div className="page-shell section-compact">
          <PageHeader
            eyebrow="New scan"
            title="What are you scanning?"
            subtitle="Choose the closest type. You can add a photo, describe the item, and refine details before analysis."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {scanTypes.map(({ id, title, text, icon: TypeIcon }) => (
              <button key={id} type="button" className="choice-card p-6" onClick={() => chooseType(id)}>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-light-purple text-deep-purple">
                  <TypeIcon size={27} />
                </div>
                <h3>{title}</h3>
                <p className="mt-3 leading-7">{text}</p>
                <div className="mt-6 flex items-center gap-2 font-bold text-deep-purple">
                  Select <ArrowRight size={17} />
                </div>
              </button>
            ))}
          </div>

          <Card className="mt-6 border-warning bg-[#FFF5EE]">
            <div className="flex gap-3">
              <AlertTriangle size={22} className="mt-1 shrink-0 text-warning" />
              <p className="leading-7">
                WasteWise will never suggest unsafe consumption of expired items. Sensitive results include safety
                gates, patch-test guidance, and disposal paths when reuse is not appropriate.
              </p>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-shell section-compact">
        <PageHeader
          eyebrow="Scan details"
          title={selectedType.title}
          subtitle="Add enough detail for component-level suggestions. You can still submit with partial information."
          onBackClick={() => setScanType('')}
        />

        <form className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]" onSubmit={handleSubmit}>
          <Card className="h-fit">
            <div className="scan-frame flex flex-col items-center justify-center p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-deep-purple shadow-card">
                <Upload size={29} />
              </div>
              <h3 className="mt-5">Add a photo</h3>
              <p className="mt-2 max-w-xs text-sm leading-6">
                A clear photo helps separate packaging, edible parts, peels, labels, and damaged components.
              </p>
              <Button variant="secondary" className="mt-5">
                Choose photo
              </Button>
            </div>

            <div className="mt-5 rounded-2xl border border-primary-green bg-light-green p-4">
              <div className="mb-2 flex items-center gap-2 font-bold text-text-primary">
                <ShieldCheck size={18} className="text-deep-green" />
                Safety first
              </div>
              <p className="text-sm leading-6">
                If an item looks moldy, smells sharp, leaks, or contains batteries, WasteWise will prioritize disposal
                and certified handling.
              </p>
            </div>
          </Card>

          <Card className="p-7">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-light-purple text-deep-purple">
                <Icon size={24} />
              </div>
              <div>
                <h3>{selectedType.title}</h3>
                <p className="text-sm">Fill what you know.</p>
              </div>
            </div>

            {scanType === 'expired_product' && <ExpiredProductFields form={form} update={update} />}
            {scanType === 'food_peels' && <FoodPeelFields form={form} update={update} />}
            {scanType === 'waste_packaging' && <PackagingFields form={form} update={update} />}
            {scanType === 'electronics' && <ElectronicsFields form={form} update={update} />}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setScanType('')}>Change type</Button>
              <Button type="submit" variant={scanType === 'electronics' ? 'success' : 'primary'} loading={loading}>
                Analyse item <ArrowRight size={17} />
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}

function ExpiredProductFields({ form, update }) {
  return (
    <div className="grid gap-5">
      <Input label="Product name" placeholder="Example: curd, coconut oil, face cream" value={form.itemName} onChange={(e) => update('itemName', e.target.value)} />
      <SelectField label="Category" value={form.category} onChange={(value) => update('category', value)} options={options.expired_product} />
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
        <SelectField label="Date type" value={form.expiryType} onChange={(value) => update('expiryType', value)} options={['best_before', 'use_by', 'expiry_date']} format />
      </div>
      <Input label="Quantity left" placeholder="Example: 200 ml, half bottle, 3 spoons" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
      <TextArea label="Ingredients or label notes" placeholder="Paste key ingredients if visible" value={form.ingredients} onChange={(e) => update('ingredients', e.target.value)} />
    </div>
  );
}

function FoodPeelFields({ form, update }) {
  return (
    <div className="grid gap-5">
      <Input label="What scraps do you have?" placeholder="Example: banana peels and apple cores" value={form.itemName} onChange={(e) => update('itemName', e.target.value)} />
      <SelectField label="Main scrap type" value={form.category} onChange={(value) => update('category', value)} options={options.food_peels} />
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Quantity" placeholder="Example: 500 g, 6 peels" value={form.quantity} onChange={(e) => update('quantity', e.target.value)} />
        <SelectField label="Condition" value={form.condition} onChange={(value) => update('condition', value)} options={['Fresh', 'Slightly dry', 'Overripe', 'Mold visible', 'Mixed condition']} />
      </div>
      <TextArea label="Notes" placeholder="Any salt, oil, spice, or contamination?" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
    </div>
  );
}

function PackagingFields({ form, update }) {
  return (
    <div className="grid gap-5">
      <Input label="Packaging item" placeholder="Example: glass jar, milk carton, plastic bottle" value={form.itemName} onChange={(e) => update('itemName', e.target.value)} />
      <SelectField label="Material" value={form.materialType || form.category} onChange={(value) => { update('materialType', value); update('category', value); }} options={options.waste_packaging} />
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField label="Size" value={form.size} onChange={(value) => update('size', value)} options={['Small', 'Medium', 'Large', 'Bulk']} />
        <SelectField label="Condition" value={form.condition} onChange={(value) => update('condition', value)} options={['Clean', 'Has food residue', 'Damaged', 'Chemical residue', 'Mixed']} />
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-border p-4 font-bold text-text-secondary">
        <input type="checkbox" checked={form.hasResidue} onChange={(event) => update('hasResidue', event.target.checked)} className="h-4 w-4 accent-deep-purple" />
        It has residue or smell
      </label>
    </div>
  );
}

function ElectronicsFields({ form, update }) {
  return (
    <div className="grid gap-5">
      <SelectField label="Device category" value={form.category} onChange={(value) => update('category', value)} options={options.electronics} />
      <Input label="Brand or model" placeholder="Optional" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField label="Device age" value={form.age} onChange={(value) => update('age', value)} options={['Less than 2 years', '2-5 years', '5-10 years', 'More than 10 years']} />
        <SelectField label="Condition" value={form.condition} onChange={(value) => update('condition', value)} options={['Working', 'Minor issue', 'Not working', 'Damaged battery', 'Broken screen', 'Unknown']} />
      </div>
      <TextArea label="Specific issue" placeholder="Example: battery swollen, screen cracked, charger not working" value={form.issue} onChange={(e) => update('issue', e.target.value)} />
      <div className="rounded-2xl border border-danger bg-[#FFF0EE] p-4">
        <div className="mb-2 flex items-center gap-2 font-bold text-text-primary">
          <AlertTriangle size={18} className="text-danger" />
          Certified handling required
        </div>
        <p className="text-sm leading-6">
          Do not open batteries, screens, or circuit boards at home. Results will prioritize repair, resale, donation,
          salvage, and certified recycling.
        </p>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options: fieldOptions, format = false }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <select className="input-field" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select</option>
        {fieldOptions.map((option) => (
          <option key={option} value={option}>
            {format ? option.replaceAll('_', ' ') : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <textarea className="input-field min-h-[110px] resize-y" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
