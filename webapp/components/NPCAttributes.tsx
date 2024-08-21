interface Attribute {
    name: string;
    description?: string | number;
  }
  
  interface NPCAttributesProps {
    skills: Attribute[];
    senses: Attribute[];
    languages: Attribute[];
    specialTraits: Attribute[];
    actions: Attribute[];
  }
  
  const NPCAttributes: React.FC<NPCAttributesProps> = ({ skills, senses, languages, specialTraits, actions }) => {
    console.log('attr', { skills, senses, languages, specialTraits, actions });
    const renderAttributeList = (attributes: Attribute[], title: string) => (
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white-1">{title}</h3>
        <ul className="list-disc pl-5">
          {attributes.map((attr, index) => (
            <li key={index} className="mb-2 text-white-1">
              <strong>{attr.name}</strong>: {attr.description}
            </li>
          ))}
        </ul>
      </div>
    );
  
    return (
      <div className="npc-attributes">
        {renderAttributeList(skills, "Skills")}
        {renderAttributeList(senses, "Senses")}
        {renderAttributeList(languages, "Languages")}
        {renderAttributeList(specialTraits, "Special Traits")}
        {renderAttributeList(actions, "Actions")}
      </div>
    );
  };
  
  export default NPCAttributes;
  