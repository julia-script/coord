"use client";

import {
  // CodeMorph,
  // CodeBlock,
  diffTokenizer,
  highlightTokens,
} from "@coord/code-motion";
import { CodeMotion } from "@coord/code-motion-react";
import "@coord/code-motion-react/dist/index.css";
import { useState } from "react";

const highlight = highlightTokens(
  "tsx",
  "future"
);
const highlightPast = highlightTokens(
  "tsx",
  "past"
);
const a = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis magna etiam tempor orci eu lobortis elementum. Non arcu risus quis varius quam quisque id. Gravida neque convallis a cras semper auctor neque vitae. Duis at tellus at urna condimentum. Nulla at volutpat diam ut venenatis. Senectus et netus et malesuada fames ac turpis. Blandit turpis cursus in hac habitasse platea dictumst quisque sagittis. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Massa id neque aliquam vestibulum morbi blandit cursus risus.

// Accumsan lacus vel facilisis volutpat est velit egestas dui id. Mauris rhoncus aenean vel elit scelerisque mauris. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Vitae tempus quam pellentesque nec nam aliquam sem et. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Cras ornare arcu dui vivamus. Dolor sit amet consectetur adipiscing elit. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Est velit egestas dui id ornare arcu odio ut. Id nibh tortor id aliquet lectus proin nibh nisl. Scelerisque in dictum non consectetur a erat. Suspendisse interdum consectetur libero id faucibus nisl. Donec enim diam vulputate ut pharetra sit amet. Lacus sed turpis tincidunt id aliquet risus. Sollicitudin nibh sit amet commodo nulla. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. Nisl rhoncus mattis rhoncus urna neque viverra justo nec.

Donec adipiscing tristique risus nec feugiat. In pellentesque massa placerat duis ultricies lacus sed turpis tincidunt. Dignissim enim sit amet venenatis urna cursus. Eget lorem dolor sed viverra ipsum. Sed turpis tincidunt id aliquet risus. Laoreet non curabitur gravida arcu. Scelerisque felis imperdiet proin fermentum leo vel orci porta. Eu ultrices vitae auctor eu augue ut lectus arcu. Rutrum quisque non tellus orci ac. Netus et malesuada fames ac. Varius sit amet mattis vulputate enim nulla aliquet. At auctor urna nunc id cursus metus aliquam eleifend. In egestas erat imperdiet sed euismod nisi porta lorem.

Netus et malesuada fames ac turpis egestas integer eget aliquet. Turpis egestas integer eget aliquet. Viverra aliquet eget sit amet tellus cras adipiscing enim. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Lectus proin nibh nisl condimentum. Malesuada bibendum arcu vitae elementum curabitur. Nulla facilisi cras fermentum odio eu. Amet aliquam id diam maecenas ultricies mi. Risus nec feugiat in fermentum. A cras semper auctor neque vitae tempus. Sagittis aliquam malesuada bibendum arcu vitae. Tristique senectus et netus et malesuada fames ac. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Massa enim nec dui nunc mattis enim ut.

At consectetur lorem donec massa sapien faucibus et molestie ac. Nunc id cursus metus aliquam. Pellentesque habitant morbi tristique senectus. Dictumst vestibulum rhoncus est pellentesque. Quam nulla porttitor massa id neque aliquam vestibulum. Commodo sed egestas egestas fringilla phasellus faucibus. Et netus et malesuada fames ac turpis egestas maecenas pharetra. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique. Facilisi cras fermentum odio eu. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Tortor at auctor urna nunc id. Amet venenatis urna cursus eget nunc scelerisque viverra mauris. Amet mauris commodo quis imperdiet massa tincidunt. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Fringilla urna porttitor rhoncus dolor. Elementum pulvinar etiam non quam lacus. Quisque sagittis purus sit amet.

// Vitae tempus quam pellentesque nec nam aliquam. Donec pretium vulputate sapien nec. Eu sem integer vitae justo eget magna. Diam vulputate ut pharetra sit amet aliquam. Gravida arcu ac tortor dignissim convallis aenean et tortor at. Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Tortor at auctor urna nunc id cursus metus aliquam. Et netus et malesuada fames. Integer quis auctor elit sed vulputate mi sit. Massa sapien faucibus et molestie ac feugiat sed lectus. Iaculis urna id volutpat lacus laoreet. Ac odio tempor orci dapibus ultrices in iaculis nunc. Pellentesque habitant morbi tristique senectus et netus et. Augue mauris augue neque gravida in. In massa tempor nec feugiat nisl pretium fusce.

At elementum eu facilisis sed odio morbi quis. Sed libero enim sed faucibus turpis. Sed arcu non odio euismod lacinia. Diam vel quam elementum pulvinar etiam non. Ut tristique et egestas quis ipsum suspendisse. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt. Nisi est sit amet facilisis magna etiam tempor orci eu. Et netus et malesuada fames. Tortor id aliquet lectus proin nibh nisl condimentum. Iaculis nunc sed augue lacus viverra vitae congue. Montes nascetur ridiculus mus mauris. Elementum nibh tellus molestie nunc non blandit massa enim. Adipiscing at in tellus integer feugiat scelerisque varius morbi. Nunc id cursus metus aliquam eleifend mi in nulla posuere.

Donec enim diam vulputate ut. Mollis nunc sed id semper risus in hendrerit gravida. Ac turpis egestas integer eget aliquet nibh praesent tristique. Pellentesque massa placerat duis ultricies lacus sed turpis. Diam donec adipiscing tristique risus. Lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis. Enim tortor at auctor urna nunc id. Aliquet enim tortor at auctor urna. Congue quisque egestas diam in. Aliquam id diam maecenas ultricies mi eget. Morbi tincidunt augue interdum velit euismod in pellentesque massa. Dignissim enim sit amet venenatis urna cursus eget nunc scelerisque. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo vel. Sed elementum tempus egestas sed sed. Bibendum at varius vel pharetra. Porta lorem mollis aliquam ut porttitor leo a. Etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus.

Ac auctor augue mauris augue neque gravida in fermentum. Posuere ac ut consequat semper. Sodales neque sodales ut etiam sit amet. Et netus et malesuada fames ac turpis. Eu consequat ac felis donec et odio pellentesque. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Gravida arcu ac tortor dignissim convallis. Id nibh tortor id aliquet lectus proin nibh. Malesuada proin libero nunc consequat interdum varius. Vitae proin sagittis nisl rhoncus mattis rhoncus. Facilisis volutpat est velit egestas dui id ornare arcu odio. Semper eget duis at tellus at urna condimentum mattis. Dui vivamus arcu felis bibendum ut. In eu mi bibendum neque egestas congue. Congue mauris rhoncus aenean vel elit. Amet venenatis urna cursus eget nunc scelerisque. Nibh tellus molestie nunc non blandit. Lorem sed risus ultricies tristique nulla aliquet enim tortor at. Suscipit adipiscing bibendum est ultricies integer quis auctor elit sed. Nibh cras pulvinar mattis nunc.
`;

const b = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis magna etiam tempor orci eu lobortis elementum. Non arcu risus quis varius quam quisque id. Gravida neque convallis a cras semper auctor neque vitae. Duis at tellus at urna condimentum. Nulla at volutpat diam ut venenatis. Senectus et netus et malesuada fames ac turpis. Blandit turpis cursus in hac habitasse platea dictumst quisque sagittis. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt. Massa id neque aliquam vestibulum morbi blandit cursus risus.

Accumsan lacus vel facilisis volutpat est  egestas dui id. Mauris rhoncus aenean vel elit scelerisque mauris. Vestibulum lorem sed risus ultricies tristique nulla aliquet enim. Vitae tempus quam pellentesque nec nam aliquam sem et. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Cras ornare arcu dui vivamus. Dolor sit amet consectetur adipiscing elit. Parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer. Est velit egestas dui id ornare arcu odio ut. Id nibh tortor id aliquet lectus proin nibh nisl. Scelerisque in dictum non consectetur a erat. Suspendisse interdum consectetur libero id faucibus nisl. Donec enim diam vulputate ut pharetra sit amet. Lacus sed turpis tincidunt id aliquet risus. Sollicitudin nibh sit amet commodo nulla. Viverra orci sagittis eu volutpat odio facilisis mauris sit amet. Nisl rhoncus mattis rhoncus urna neque viverra justo nec.

Donec adipiscing tristique risus nec feugiat. In pellentesque massa placerat duis ultricies lacus sed turpis tincidunt. Dignissim enim sit amet venenatis urna cursus. Eget lorem dolor sed viverra ipsum. Sed turpis tincidunt id aliquet risus. Laoreet non curabitur gravida arcu. Scelerisque felis imperdiet proin fermentum leo vel orci porta. Eu ultrices vitae auctor eu augue ut lectus arcu. Rutrum quisque non tellus orci ac. Netus et malesuada fames ac. Varius sit amet mattis vulputate enim nulla aliquet. At auctor urna nunc id cursus metus aliquam eleifend. In egestas erat imperdiet sed euismod nisi porta lorem.

Netus et malesuada fames ac turpis egestas integer eget aliquet. Turpis egestas integer eget aliquet. Viverra aliquet eget sit amet tellus cras adipiscing enim. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Lectus proin nibh nisl condimentum. Malesuada bibendum arcu vitae elementum curabitur. Nulla facilisi cras fermentum odio eu. Amet aliquam id diam maecenas ultricies mi. Risus nec feugiat in fermentum. A cras semper auctor neque vitae tempus. Sagittis aliquam malesuada bibendum arcu vitae. Tristique senectus et netus et malesuada fames ac. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Massa enim nec dui nunc mattis enim ut.

At consectetur lorem donec massa sapien faucibus et molestie apenatibusc. Nunc id cursus metus aliquam. Pellentesque habitant morbi tristique senectus. Dictumst vestibulum rhoncus est pellentesque. Quam nulla porttitor massa id neque aliquam vestibulum. Commodo sed egestas egestas fringilla phasellus faucibus. Et netus et malesuada fames ac turpis egestas maecenas pharetra. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique. Facilisi cras fermentum odio eu. Blandit cursus risus at ultrices mi tempus imperdiet nulla. Tortor at auctor urna nunc id. Amet venenatis urna cursus eget nunc scelerisque viverra mauris. Amet mauris commodo quis imperdiet massa tincidunt. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Fringilla urna porttitor rhoncus dolor. Elementum pulvinar etiam non quam lacus. Quisque sagittis purus sit amet.

// Sociis natoque  et magnis dis parturient montes. Velit aliquet sagittis id consectetur purus ut. Scelerisque eu ultrices vitae auctor eu augue. Non blandit massa enim nec dui. Feugiat nibh sed pulvinar proin. Tellus at urna condimentum mattis. Mattis vulputate enim nulla aliquet. Velit euismod in pellentesque massa. Arcu dui vivamus arcu felis bibendum ut tristique et. Sit amet purus gravida quis blandit turpis cursus. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Eu volutpat odio facilisis mauris sit. Id interdum velit laoreet id donec ultrices. Ornare quam viverra orci sagittis eu volutpat odio. Vel facilisis volutpat est velit egestas dui id ornare arcu. Velit aliquet sagittis id consectetur purus ut faucibus.

Vitae tempus quam pellentesque nec nam aliquam. Donec pretium vulputate sapien nec. Eu sem integer vitae justo eget magna. Diam vulputate ut pharetra sit amet aliquam. Gravida arcu ac tortor dignissim convallis aenean et tortor at. Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Tortor at auctor urna nunc id cursus metus aliquam. Et netus et malesuada fames. Integer quis auctor elit sed vulputate mi sit. Massa sapien faucibus et molestie ac feugiat sed lectus. Iaculis urna id volutpat lacus laoreet. Ac odio tempor orci dapibus ultrices in iaculis nunc. Pellentesque habitant morbi tristique senectus et netus et. Augue mauris augue neque gravida in. In massa tempor nec feugiat nisl pretium fusce.

At elementum eu facilisis sed odio morbi quis. Sed linambero enim sed faucibus turpis. Sed arcu non odio euismod lacinia. Diam vel quam elementum pulvinar etiam non. Ut tristique et egestas quis ipsum suspendisse. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt. Nisi est sit amet facilisis magna etiam tempor orci eu. Et netus et malesuada fames. Tortor id aliquet lectus proin nibh nisl condimentum. Iaculis nunc sed augue lacus viverra vitae congue. Montes nascetur ridiculus mus mauris. Elementum nibh tellus molestie nunc non blandit massa enim. Adipiscing at in tellus integer feugiat scelerisque varius morbi. Nunc id cursus metus aliquam eleifend mi in nulla posuere.

Donec enim diam vulputate ut. Mollis nunc sed id semper risus in hendrerit gravida. Ac turpis egestas integer eget aliquet nibh praesent tristique. Pellentesque massa placerat duis ultricies lacus sed turpis. Diam donec adipiscing tristique risus. Lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis. Enim tortor at auctor urna nunc id. Aliquet enim tortor at auctor urna. Congue quisque egestas diam in. Aliquam id diam maecenas ultricies mi eget. Morbi tincidunt augue interdum velit euismod in pellentesque massa. Dignissim enim sit amet venenatis urna cursus eget nunc scelerisque. Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo vel. Sed elementum tempus egestas sed sed. Bibendum at varius vel pharetra. Porta lorem mollis aliquam ut porttitor leo a. Etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus.

Ac Mollis augue mauris augue neque gravida in fermentum. Posuere ac ut consequat semper. Sodales neque sodales ut etiam sit amet. Et netus et malesuada fames ac turpis. Eu consequat ac felis donec et odio pellentesque. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Gravida arcu ac tortor dignissim convallis. Id nibh tortor id aliquet lectus proin nibh. Malesuada proin libero nunc consequat interdum varius. Vitae proin sagittis nisl rhoncus mattis rhoncus. Facilisis volutpat est velit egestas dui id ornare arcu odio. Semper eget duis at tellus at urna condimentum mattis. Dui vivamus arcu felis bibendum ut. In eu mi bibendum neque egestas congue. Congue mauris rhoncus aenean vel elit. Amet venenatis urna cursus eget nunc scelerisque. Nibh tellus molestie nunc non blandit. Lorem sed risus ultricies tristique nulla aliquet enim tortor at. Suscipit adipiscing bibendum est ultricies integer quis auctor elit sed. Nibh cras pulvinar mattis nunc.

`;

const codeA = `
function hello() {/* do something */}
`;

const codeB = `
function hello() {
  console.log("hello world");
}
`;
export default function Page() {
  const [transition, setTransition] =
    useState(0.5);
  const [code, setCode] = useState(codeA);
  const [textareaCode, setTextareaCode] =
    useState(codeB);
  return (
    <div className="m-auto flex max-w-xl flex-col justify-center">
      <CodeMotion
        // transitionTime={transition}
        code={code}
        // transitionMode="typewriter"
        language="tsx"
      />

      <input
        type="range"
        min="0"
        max="1"
        step="0.005"
        value={transition}
        onChange={(e) =>
          setTransition(
            parseFloat(e.target.value)
          )
        }
      />
      <textarea
        className="bg-dark mt-4 h-40 w-full border border-neutral-400/10"
        value={textareaCode}
        onChange={(e) => {
          console.log(e.target.value);
          setTextareaCode(e.target.value);
        }}
      />
      <button
        className="btn btn-primary mt-4"
        onClick={() => setCode(textareaCode)}
      >
        Update
      </button>
    </div>
  );
}
