(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();async function w(a,e){try{const t=await fetch("http://localhost:8090/auth/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a,password:e})});if(t.ok){app.router.go("/");return}return t}catch(t){return console.error("There was an error while trying to login the user: ",t),t}}class f extends HTMLElement{constructor(){super(),this.error=!1}connectedCallback(){this.render()}displayErrorMessage(e){this.error=!0;const t=document.querySelector("#error-message"),n=document.createElement("p");n.className="text-sm text-red-700",n.innerText=e,t.appendChild(n),setTimeout(()=>{t.removeChild(n),this.error=!1},[2e3])}showSpinnerInButton(e){const t=document.querySelector(`#${e}`);t.innerHTML=`
			<div class="h-6">
				<spinner-component></spinner-component>
			</div> 
		`}hideSpinnerInButton(e){const t=document.querySelector(`#${e}`),n={"login-button":"Login"};t.innerHTML="",t.innerText=n[e]}render(){this.innerHTML=`		
			<auth-card
				data-goToLabel="Signup"
				data-goToLink="/signup"
				data-cardTitle="Please enter your email and password"
				data-buttonLabel="Login"
			>
				<div id='auth-card-children' class="flex flex-col gap-y-2">
					<form id="login-form" method="post" action="/auth/login" 
						class="flex flex-col gap-y-2 w-full"
					>
						<div id='auth-card-children' class="flex flex-col gap-y-2">
							<input-component data-type="email"></input-component>
							<input-component data-type="password" data-login="true" ></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button id="login-button" type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Login
							</button>
						</div>
					</form>
				</div>
			</auth-card>
		`;const e=this.querySelector("#login-form");e==null||e.addEventListener("submit",async t=>{if(t.preventDefault(),this.error)return;this.showSpinnerInButton("login-button");const{email:n,password:s}=Object.fromEntries(new FormData(e));if(!n||!s){this.hideSpinnerInButton("login-button"),!n&&s?this.displayErrorMessage("Please enter an email address"):!s&&n?this.displayErrorMessage("Please enter your password"):this.displayErrorMessage("Please enter your email and password");return}const o=await w(n,s);o&&(this.hideSpinnerInButton("login-button"),this.displayErrorMessage("Wrong email or password"),console.error(o))})}}customElements.define("login-page",f);function v(a){a.querySelectorAll("a.navlink").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const n=e.href;app.router.go(n)})})}class g extends HTMLElement{constructor(){super()}connectedCallback(){this.render(),this.addEventListener("update-list",this.getList),this.addEventListener("get-list",this.getList),this.style.width="",this.className="flex flex-col w-full items-center",document.body.classList.add("bg-slate-50")}renderList(e){e.length===0?list.innerHTML="<h1>No names yet</h1>":list.innerHTML=e.map(t=>`
				<card-component 
					data-id="${t.id}"
					data-name="${t.title}"
					data-content="${t.content}"
				>
				</card-component>
			`).join("")}async getList(){console.log("getList() invoked...");const e=await fetch("http://localhost:8090/list",{method:"GET",credentials:"include"}),{names:t}=await e.json();list.innerHTML="",app.store.notes=t,this.renderList(app.store.notes)}render(){console.log(this.zComment),this.innerHTML=`
			<div id='main-page' class="page flex flex-col w-full max-w-[1200px] min-h-[100vh] h-fit items-center bg-slate-50">
				<div id="header-bar" class="flex flex-row w-full justify-between ">
					<div class="flex flex-row gap-x-4 w-[120px]"></div>
					<div class="flex flex-row gap-x-6 w-fit justify-center">
						<a href="/" class="navlink cursor-pointer w-fit">
							Home
						</a>
						<a href="/new-page" class="navlink cursor-pointer w-fit">
							New Page
						</a>
					</div>
					<div class="flex flex-row gap-x-4 w-fit">
						<div id="display-current-user" class="">
							...
						</div>
						<button 
							id="log-out" 
							class="flex flex-row items-center justify-center 
								rounded-md bg-gray-300 font-light text-sm px-2 py-1 min-w-14 
								hover:brightness-95 transition-all"
						>
							Logout
						</button>
					</div>
				</div>
				<div class="flex flex-col py-10 max-w-[1200px] gap-y-4 items-center px-4 sm:px-10 lg:px-20">
					<h1 id="hello" class="text-2xl font-semibold w-fit">My Notes</h1>
					<button id="add-modal"> New note </button>
					<div id="list" class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
						<div class="flex flex-row w-full justify-center">
							<spinner-component></spinner-component>
						</div>
					</div>
				</div>
			</div>
		`,v(this),this.style.width="100%";const e=this.querySelector("#log-out"),t=this.querySelector("#list"),n=this.querySelector("#display-current-user"),s=this.querySelector("#add-modal");app.store.notes?this.renderList(app.store.notes):this.getList(),o(),s.addEventListener("click",()=>{const l=document.createElement("dialog");l.className="border border-black rounded-md p-6 w-full max-w-[600px] h-full max-h-[600px]",l.id="modal",l.innerHTML=`
				<div class="h-full flex flex-col gap-y-4">
					<div class="flex flex-row justify-end">
						<button class="self-end text-sm text-gray-500 font-light hover:text-gray-900 transition-all" 
							id="closeButton"
						>
							close
						</button>
					</div>
					<div class="flex flex-col gap-y-4 h-full">
						<form 
							id="add-name-form" 
							method="post" 
							class="flex flex-col gap-y-2 justify-between h-full"
							action="/list"
							target="hidden-iframe"
						>
							<div class="flex flex-col h-full gap-y-2">
								<input type="text" id="new-name" name="name" class="border border-black px-2"/>
								<textarea id="new-content" name="content" class="border border-black px-2 h-full"/>
								</textarea>
							</div>
							<button id="login-button" type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Save
							</button>
							<iframe name="hidden-iframe" style="display:none;"></iframe>
						</form>
					</div>
				</div>
			`,document.body.appendChild(l),l.addEventListener("click",p=>{const h=l.getBoundingClientRect();h.top<=p.clientY&&p.clientY<=h.top+h.height&&h.left<=p.clientX&&p.clientX<=h.left+h.width||l.close()}),document.startViewTransition(()=>l.showModal()),l.querySelector("#closeButton").addEventListener("click",()=>{l.close()});const c=l.querySelector("#add-name-form");c==null||c.addEventListener("submit",async p=>{p.preventDefault(),document.querySelector("#modal").close(),console.log("here");const m=Object.fromEntries(new FormData(c)),{name:T,content:S}=m;r(T,S),(await fetch("/list",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).ok?(console.log("response ok"),c.reset(),this.getList()):(console.error("Failed to add name"),t.firstElementChild.remove())})}),e==null||e.addEventListener("click",async l=>{l.preventDefault(),(await fetch("/auth/logout",{method:"POST",headers:{"Content-Type":"application/json"}})).ok&&app.router.go("/login")});async function o(){try{if(!app.store.user){const l=await i();app.store.user=l}n.innerHTML="",n.innerHTML=`${app.store.user}`}catch(l){console.error(l)}}async function i(){const u=await(await fetch("http://localhost:8090/current-user",{method:"GET",credentials:"include"})).json();if(u)return u.user.email}function r(l,u){const c=document.createElement("card-component");c.setAttribute("data-id",l.id),c.setAttribute("data-name",l),c.setAttribute("data-content",u),t.prepend(c)}const d=document.querySelector("iframe");d&&(d.onload=function(){location.reload()})}}customElements.define("main-page",g);async function E(a){console.warn("Sending email!");const e=await fetch("/auth-code/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:a})});return console.log(e),e}class L extends HTMLElement{constructor(){super(),this.stateInit={emailEntered:!1,codeVerified:!1,email:""},this.state=new Proxy(this.stateInit,{set:(e,t,n)=>(e[t]=n,this.render(),t==="noUserExists"&&n===!0&&setTimeout(()=>{this.state.noUserExists=!1,this.render()},3e3),!0)})}connectedCallback(){this.render()}displayErrorMessage(e){this.error=!0;const t=document.querySelector("#error-message");console.log("error message: ",t);const n=document.createElement("p");n.className="text-sm text-red-700",n.innerText=e,t.appendChild(n),setTimeout(()=>{t.removeChild(n),this.error=!1},[2e3])}showSpinnerInButton(e){console.log("show spinner");const t=document.querySelector(`#${e}`);t.innerHTML=`
			<div class="h-6">
				<spinner-component></spinner-component>
			</div> 
		`}hideSpinnerInButton(e){const t=document.querySelector(`#${e}`),n={"send-email-button":"Send","reset-password-button":"Reset","send-code-button":"Submit"};t.innerHTML="",t.innerText=n[e]}render(){this.innerHTML=`
		<auth-card
			data-goToLabel="Login"
			data-goToLink="/login"
			data-cardTitle=""
		>
			<div id='auth-card-children' class="flex flex-col gap-y-2 w-full">
				<div class="flex flex-col gap-y-4 items-start w-full">
					${this.state.emailEntered?"":`
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							Enter your email here
						</h1>
						<form id="enter-email" method="post" action="/auth/auth-code/create" class="flex flex-col gap-y-2 w-full">
							<input-component data-type="email"></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button 
								id="send-email-button" 
								type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Send
							</button>
						</form> 
					`}
					${this.state.emailEntered&&!this.state.codeVerified?`
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							We have sent you a verification code
						</h1>
						<form id="verify-code" method="post" action="/auth-code/verify" class="flex flex-col gap-y-2 w-full">
							<input-component data-type="code"></input-component>
							<div id="error-message" class="min-h-[20px]"></div>
							<button 
								id="send-code-button" 
								type="submit"
								class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
									h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
							>
								Send
							</button>
						</form>`:""}
					${this.state.emailEntered&&this.state.codeVerified?`
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							Reset your password here
						</h1>
						<form id="reset-pw-form" method="post" action="/auth/reset" class="flex flex-col gap-y-2 w-full">
						<input-component data-type="new_password"></input-component>
						<input-component data-type="repeat_password"></input-component>
						<div id="error-message" class="min-h-[20px]"></div>
						<button 
							id="reset-password-button" 
							type="submit"
							class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
								h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
						>
							Reset
						</button>
						</form>`:""}
				</div>
			</div>
			<auth-card>
		`;const e=document.getElementById("reset-pw-form");e==null||e.addEventListener("submit",async o=>{o.preventDefault(),this.showSpinnerInButton("reset-password-button");const{new_password:i,repeat_password:r}=Object.fromEntries(new FormData(e)),d=new URL(e.action).pathname;if(!i||!r){this.hideSpinnerInButton("reset-password-button"),i?this.displayErrorMessage("Please repeat your password"):r?this.displayErrorMessage("Please enter your password"):this.displayErrorMessage("Please enter your password in both boxes");return}else if(i!=r){this.displayErrorMessage("Passwords don't match"),this.hideSpinnerInButton("reset-password-button");return}if(!(await fetch(d,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.state.email,password:i})})).ok){this.hideSpinnerInButton("reset-password-button"),this.displayErrorMessage("Something went wrong while trying to reset your password"),console.error("Something went wrong while trying to reset your password");return}w(this.state.email,i)});const t=document.getElementById("get-new-code");t==null||t.addEventListener("click",()=>{console.log("click"),this.state.codeInvalid=!1,this.state.emailEntered=!1,this.state.codeVerified=!1});const n=document.getElementById("enter-email");n==null||n.addEventListener("submit",async o=>{if(o.preventDefault(),this.error)return;this.showSpinnerInButton("send-email-button");const{email:i}=Object.fromEntries(new FormData(n));if(!(await(await fetch("/auth/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i})})).json()).userExists){this.hideSpinnerInButton("send-email-button"),this.displayErrorMessage("No user with this email exists"),console.error("No user with this email exists");return}if(!(await E(i)).ok){this.hideSpinnerInButton("send-email-button"),this.displayErrorMessage("Something went wrong while trying to send you an email"),console.error("Something went wrong while trying to send you an email");return}this.state.emailEntered=!0,this.state.email=i});const s=document.getElementById("verify-code");s==null||s.addEventListener("submit",async o=>{o.preventDefault(),this.showSpinnerInButton("send-code-button");const{code:i}=Object.fromEntries(new FormData(s)),r=new URL(s.action).pathname;if(!(await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:i,email:this.state.email})})).ok){this.hideSpinnerInButton("send-code-button"),this.displayErrorMessage("Code is not valid"),console.error("Code is not valid");return}this.state.codeVerified=!0})}}customElements.define("reset-pw-page",L);class y extends HTMLElement{constructor(){super(),this.stateInit={showCode:!1,email:"",password:"",verify:!1,error:!1},this.state=new Proxy(this.stateInit,{set:(e,t,n)=>(e[t]=n,t==="showCode"&&this.render(),!0)})}connectedCallback(){this.render()}displayErrorMessage(e){this.state.error=!0;const t=document.querySelector("#error-message"),n=document.createElement("p");n.className="text-sm text-red-700",n.innerText=e,t.appendChild(n),setTimeout(()=>{t.removeChild(n),this.state.error=!1},[2e3])}showSpinnerInButton(e){const t=document.querySelector(`#${e}`);t.innerHTML=`
			<div class="h-6">
				<spinner-component></spinner-component>
			</div> 
		`}hideSpinnerInButton(e){const t=document.querySelector(`#${e}`),n={"sign-up-button":"Sign Up","verify-button":"Verify"};t.innerHTML="",t.innerText=n[e]}render(){this.innerHTML=`
				<auth-card
					data-goToLabel="Login"
					data-goToLink="/login"
					data-cardTitle="${this.state.showCode?"Enter the verification code we've sent you":"Sign up here"}"
					data-buttonLabel="Sign Up"
				>
					<div id='auth-card-children' class="flex flex-col gap-y-2">
						${this.state.showCode?`
							<form id="verify-form" method="post" action="/auth-code/verify" 
								class="flex flex-col gap-y-2 w-full"
							>
								<div id='auth-card-children' class="flex flex-col gap-y-2">
									<input-component data-type="code"></input-component>
									<div id="error-message" class="min-h-[20px]"></div>
									<button id="verify-button" type="submit"
										class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
											h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
									>
										Verify
									</button>
								</div>
							</form>
						`:`
							<form id="signup-form" method="post" action="/auth/signup" 
								class="flex flex-col gap-y-2 w-full"
							>
								<div id='auth-card-children' class="flex flex-col gap-y-2 w-full">
									<input-component data-type="email"></input-component>
									<input-component data-type="password"></input-component>
									<div id="error-message" class="min-h-[20px]"></div>
									<button id="sign-up-button" type="submit"
										class="flex flex-col justify-center items-center rounded-md bg-gray-300 font-light 
											h-10 mt-8 text-base px-2 py-1 min-w-14 hover:brightness-95 transition-all"
									>
										Sign Up
									</button>
								</div>
							</form>
						`} 
					</div>
				</auth-card>
		`,setTimeout(()=>{const e=this.querySelector("#signup-form");e==null||e.addEventListener("submit",async n=>{if(n.preventDefault(),this.state.error)return;this.showSpinnerInButton("sign-up-button");const{email:s,password:o}=Object.fromEntries(new FormData(e));if(!s||!o){this.hideSpinnerInButton("sign-up-button"),!s&&o?this.displayErrorMessage("Please enter an email address"):!o&&s?this.displayErrorMessage("Please enter a password"):this.displayErrorMessage("Please provide both an email and a password");return}const d=(await(await fetch("/auth/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s})})).json()).userExists;if(console.log("userAlreadyExists: ",d),d){this.displayErrorMessage("A user with this email already exists"),this.hideSpinnerInButton("sign-up-button");return}this.state.signingUp=!0;const l=await E(s);if(!l.ok){this.displayErrorMessage("We encountered an error while trying to send your email. Pleas try again later."),console.error("ERROR while sending email",await l.json()),this.hideSpinnerInButton("sign-up-button");return}this.state.email=s,this.state.password=o,this.state.showCode=!0});const t=document.querySelector("#verify-form");t==null||t.addEventListener("submit",async n=>{if(this.state.error)return;n.preventDefault(),this.showSpinnerInButton("verify-button");const{code:s}=Object.fromEntries(new FormData(t));if(!(await fetch("/auth-code/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.state.email,code:s})})).ok){this.hideSpinnerInButton("verify-button"),this.displayErrorMessage("Code is not correct"),console.error("Code is not correct");return}if(!(await fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:this.state.email,password:this.state.password})})).ok){this.hideSpinnerInButton("verify-button"),this.displayErrorMessage("There was an error while creating the user"),console.error("There was an error while creating the user");return}w(this.state.email,this.state.password)})},0)}}customElements.define("signup-page",y);const b={init:()=>{const a=location.href,e=location.origin,t=a.substring(e.length);if(window.addEventListener("popstate",n=>{console.log("popstate"),b.go(n.state.route,!1)}),t==="/login"){const n=new f;document.body.appendChild(n)}else if(t==="/signup"){const n=new y;document.body.appendChild(n)}else b.go(location.href)},go:async(a,e=!0)=>{const t=location.origin,n=a.substring(t.length).length;if(a.length>0&&n<a.length&&n>0&&(a=a.substring(t.length)),!["/login","/signup","/reset-password"].includes(a)){const r=await(await fetch("http://localhost:8090/auth/verify",{method:"POST",headers:{"Content-Type":"application/json"}})).json();if(r.redirect){window.location.href=r.redirect;return}}e&&(history.pushState({route:a},null,a),document.title="Cool website");function o(){switch(t+a){case t+"/":document.body.innerHTML="";const i=new g;document.body.appendChild(i);break;case t+"/signup":document.body.innerHTML="";const r=new y;document.body.appendChild(r);break;case t+"/login":document.body.innerHTML="";const d=new f;document.body.appendChild(d);break;case t+"/reset-password":document.body.innerHTML="";const l=new L;document.body.appendChild(l);break;default:document.body.innerHTML="";const u=new g;document.body.appendChild(u);break}}document.startViewTransition?document.startViewTransition(()=>o()):o()}},x=a=>{console.log(a.target);const e=a.target,t=e.textContent.trim();let n=document.querySelector("#title-input");n||(n=document.createElement("input"),n.type="text",n.id="title-input",n.value=t,n.className="focus:outline-none bg-transparent"),e.textContent="",e.appendChild(n),e.addEventListener("get-list",()=>console.log("get list")),n.focus();const s=async o=>{o.preventDefault();const i=n.value.trim();if(i!==t){e.innerHTML="",e.textContent=i;try{const r=e.getAttribute("data-id");if(!(await fetch(`http://localhost:8090/list/${r}`,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:i})})).ok)throw e.innerHTML="",e.textContent=t,new Error("ERROR: Failed to update name");document.querySelector("#main-page").dispatchEvent(new CustomEvent("get-list",{bubbles:!0}))}catch(r){console.error("Error updating name:",r)}}else e.innerHTML="",e.textContent=t};n==null||n.addEventListener("keypress",o=>{o.key==="Enter"&&s(o)}),n==null||n.addEventListener("blur",s)},C=a=>{console.log("edit content");const e=a.target,t=e.getAttribute("data-id"),n=e.innerHTML.replace(/<br\s*\/?>/gi,`
`).replace(/&nbsp;/g," ").trim();a.target.style.overflowY="hidden",document.body.style.overflow="hidden";let s=document.querySelector(`#content-input${t}`);s||(console.log("creating an input"),s=document.createElement("textarea"),s.id="content-input${id}",s.value=n,s.style.resize="none",s.className="focus:outline-none bg-gray-50 w-full h-full scrollable"),e.textContent="",e.appendChild(s),e.addEventListener("get-list",()=>console.log("get list")),s.focus();const o=async i=>{a.target.style.overflowY="auto",i.preventDefault();const r=s.value.replace(/\n/g,"<br>").replace(/  /g,"&nbsp;&nbsp;");if(r!==n){e.innerHTML="",e.innerHTML=r,console.log("inputElement.value.: ",s.value);try{if(!(await fetch(`http://localhost:8090/list/${t}`,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:r})})).ok)throw e.innerHTML="",e.textContent=n,new Error("ERROR: Failed to update name");document.querySelector("#main-page").dispatchEvent(new CustomEvent("get-list",{bubbles:!0}))}catch(d){console.error("Error updating content:",d)}}else e.innerHTML="",e.textContent=n};s==null||s.addEventListener("keydown",i=>{i.key==="Escape"&&(i.preventDefault(),o(i))}),s==null||s.addEventListener("keydown",i=>{if(console.log(i.key),(i.metaKey||i.ctrlKey)&&i.key==="Enter"){i.preventDefault();const r=s.selectionStart,d=s.value.substring(0,r),l=s.value.substring(r);s.value=d+`
`+l,s.setSelectionRange(r+1,r+1)}else i.key==="Enter"&&(i.preventDefault(),o(i))}),s==null||s.addEventListener("blur",o)};class k extends HTMLElement{constructor(){super()}connectedCallback(){this.noteId=this.dataset.id,this.noteTitle=this.dataset.name,this.content=this.dataset.content,this.addEventListener("click",e=>{if(["delete-button","title"].includes(e.target.id))return;const t=document.createElement("dialog");t.id=`modal-note-${this.noteId}`,t.className="border border-black rounded-md p-6 pl-8 w-full max-w-[600px] h-full max-h-[600px] overflow-hidden",t.innerHTML=`
				<div class="flex flex-row justify-end mb-6">
					<button class="self-end text-sm text-gray-500 font-light hover:text-gray-900 transition-all" 
						id="closeButton"
					>
						close
					</button>
				</div>
				<div class="flex flex-col gap-y-4 overflow-hidden justify-between h-full">
					<div class="flex flex-col gap-y-4 overflow-hidden h-full">
						<h1 id="note-title${this.noteId}" class="font-bold text-2xl" data-id="${this.noteId}">
							${this.noteTitle}
						</h1>
						<h1 
							id="note-content${this.noteId}"
							data-id="${this.noteId}"
							class="font-light text-large focus:outline-none overflow-y-auto h-[75%]"
						>
							${this.content||"[Insert content here...]"}
						</h1>
					</div>
					<div id="buttons-container"></div>
				</div>
			`,console.log(`#note-content${this.noteId}`),document.body.appendChild(t),document.body.style.overflow="hidden";const n=document.getElementsByTagName("main-page");n.length!=0&&(n[0].style.marginRight="16px"),document.querySelector(`#note-title${this.noteId}`).addEventListener("click",r=>{x(r)});const o=document.querySelector(`#note-content${this.noteId}`);o.classList.add("scrollable"),o.addEventListener("click",r=>{C(r)}),t.addEventListener("keydown",r=>{console.log("preventing closure"),r.key==="Escape"&&r.preventDefault()}),t.addEventListener("click",r=>{const d=t.getBoundingClientRect();d.top<=r.clientY&&r.clientY<=d.top+d.height&&d.left<=r.clientX&&r.clientX<=d.left+d.width||(t.close(),document.body.style.overflow="auto",document.body.removeChild(t),n.length!=0&&(n[0].style.marginRight="0px"))}),document.startViewTransition(()=>t.showModal()),t.querySelector("#closeButton").addEventListener("click",()=>{console.log("closing modal"),t.close(),document.body.style.overflow="auto",document.body.removeChild(t),n.length!=0&&(n[0].style.marginRight="0px")})}),this.render()}async deleteName(e){e.target.closest("card-component").remove();const t=e.target.getAttribute("data-id");(await fetch(`http://localhost:8090/list/${t}`,{method:"DELETE",credentials:"include"})).ok||console.error("Failed to delete the name"),document.getElementById("list").dispatchEvent(new CustomEvent("update-list",{bubbles:!0}))}render(){this.innerHTML=`
			<div class="flex flex-col justify-between w-full group hover:bg-yellow-50 cursor-pointer
					 p-4 bg-white shadow shadow-gray-700 rounded-lg transition gap-y-6 min-w-[280px]
					 h-[280px]"
			>
				<div class="flex flex-col gap-y-4 justify-start h-full">
					<div id="title" class="name-item w-full text-wrap hover:text-blue-600 cursor-pointer font-semibold text-lg" 
						data-id="${this.noteId}"
					>
						${this.noteTitle}
					</div>
					<div 
						id="content"
						class="w-full text-wrap  cursor-pointer font-light text-base line-clamp-6" 
						data-id="${this.noteId}"
					>
						${this.content}
					</div>
				</div>
				<button id="delete-button" class="delete-button text-gray-300 cursor-pointer hover:text-red-600" data-id="${this.noteId}">
					Delete
				</button>
			</div>
		`,this.addEventListener("click",e=>{e.target.classList.contains("delete-button")?this.deleteName(e):e.target.classList.contains("name-item")&&x(e)})}}customElements.define("card-component",k);class M extends HTMLElement{constructor(){super()}connectedCallback(){const e=document.createElement("div");e.innerHTML=`
			<div class="animate-spin self-center justify-self-center inline-block size-6 max-h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
			</div>
		`,this.appendChild(e)}}customElements.define("spinner-component",M);class I extends HTMLElement{constructor(){super(),this.stateInit={smallLabel:!1,justFocused:!1,justBlurred:!1},this.state=new Proxy(this.stateInit,{set:(e,t,n)=>(e[t]=n,t==="smallLabel"&&this.render(),!0)})}connectedCallback(){this.render()}render(){const e=this.dataset.type;this.innerHTML="",this.innerHTML=`
			<div class="flex flex-col relative h-fit w-full">
				<p 
					id="${e}Label" 
					class="${`
						${this.state.smallLabel?"top-[5px] text-xs text-blue-700":"top-[15px] text-sm text-slate-400"} 
						left-2 max-h-0 transition relative
					`}"
				>
					${e[0].toUpperCase()+e.slice(1).replace(/_/g," ")}
				</p>
				<input 
					type=${e.includes("password")?"password":e} 
					id=${e} 
					name=${e} 
					autocomplete=${e} 
					class="border border-gray-600 px-2 w-full h-12 font-light rounded-md ${this.state.smallLabel?"pt-4":""}"
				/>
				<div class="${e==="password"?this.dataset.login?"visible":"invisible":"hidden"}
					flex flex-row w-full mt-1 justify-end"
				>
					<a href="/reset-password" class="navlink text-xs">
						Forgot password?
					</a>
				</div>
			</div>
		`,this.querySelectorAll("a.navlink").forEach(t=>{t.addEventListener("click",n=>{n.preventDefault();const s=t.href;app.router.go(s)})}),setTimeout(()=>{const t=document.getElementById(`${e}`),n=document.getElementById(`${e}Label`);t==null||t.addEventListener("focus",()=>{this.state.justFocused||(this.state.smallLabel=!0),this.state.justFocused=!0}),t==null||t.addEventListener("blur",s=>{s.target.value===""&&this.state.justFocused&&(this.state.justFocused=!1,this.state.smallLabel=!1)}),n==null||n.addEventListener("click",()=>{t&&t.focus(),this.state.smallLabel=!0}),this.state.justFocused?t.focus():t==null||t.blur()},0)}}customElements.define("input-component",I);class j extends HTMLElement{constructor(){super()}connectedCallback(){this.render(),document.body.classList.add("bg-slate-300")}render(){const{gotolabel:e,gotolink:t,cardtitle:n}={...this.dataset},s=document.querySelector("#auth-card-children");this.innerHTML=`
			<div class="page flex flex-col w-screen h-screen items-center justify-between p-6">
				<div id="header-bar" class="flex flex-row justify-end w-full gap-x-6">
					<a href="${t}" class="navlink" cursor-pointer w-fit">
						${e}
					</a>
				</div>
				<div 
					class="flex shadow-gray-400 shadow-md p-6  rounded-lg flex-col gap-y-4
					items-start mb-10 max-w-[400px] w-full justify-center bg-slate-50"
				>
					${n!=""?`
						<h1 class="text-base font-medium mb-8 w-fit self-center">
							${n}
						</h1> `:""}
					<div id="slot" class="w-full"></div>			
				</div>
				<div class="h-full max-h-20 w-full"></div>
			</div>
		`,v(this);const o=document.querySelector("#slot");o&&s&&o.appendChild(s)}}customElements.define("auth-card",j);const $={notes:null,user:null};window.app={};app.router=b;app.store=$;window==null||window.addEventListener("DOMContentLoaded",()=>{app.router.init()});
