import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let scripts = Map.empty<Text, Script>();
  let deletedScripts = Map.empty<Text, Script>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var scriptIdCounter : Nat = 0;

  public type Script = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    content : Text;
    author : Principal;
    createdAt : Int;
    updatedAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Script {
    public func compareByTitle(script1 : Script, script2 : Script) : Order.Order {
      Text.compare(script1.title, script2.title);
    };
  };

  // User Profile Management (requires authentication)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Publicly accessible script read operations (no authentication required - accessible to all including guests)
  public query func getScript(id : Text) : async Script {
    switch (scripts.get(id)) {
      case (null) { Runtime.trap("Script not found") };
      case (?script) { script };
    };
  };

  public query func getAllScripts() : async [Script] {
    scripts.values().toArray();
  };

  public query func searchScriptsByTitle(title : Text) : async [Script] {
    scripts.values().toArray().filter(func(script) { script.title.contains(#text title) });
  };

  public query func filterScriptsByCategory(category : Text) : async [Script] {
    scripts.values().toArray().filter(func(script) { script.category == category });
  };

  public query func getScriptsByAuthor(author : Principal) : async [Script] {
    scripts.values().toArray().filter(func(script) { script.author == author });
  };

  // Get deleted scripts for the caller (requires user authentication)
  public query ({ caller }) func getDeletedScripts() : async [Script] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view deleted scripts");
    };
    
    if (AccessControl.isAdmin(accessControlState, caller)) {
      // Admins can see all deleted scripts
      deletedScripts.values().toArray();
    } else {
      // Regular users can only see their own deleted scripts
      deletedScripts.values().toArray().filter(func(script) { script.author == caller });
    };
  };

  // Script write operations (require user authentication)
  public shared ({ caller }) func createScript(
    title : Text,
    description : Text,
    category : Text,
    content : Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create scripts");
    };

    let scriptId = Nat.toText(scriptIdCounter);
    scriptIdCounter += 1;

    let now = Time.now();
    let newScript : Script = {
      id = scriptId;
      title = title;
      description = description;
      category = category;
      content = content;
      author = caller;
      createdAt = now;
      updatedAt = now;
    };

    scripts.add(scriptId, newScript);
    scriptId;
  };

  public shared ({ caller }) func updateScript(
    id : Text,
    title : Text,
    description : Text,
    category : Text,
    content : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update scripts");
    };

    switch (scripts.get(id)) {
      case (null) { Runtime.trap("Script not found") };
      case (?existingScript) {
        if (existingScript.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only update your own scripts");
        };

        let updatedScript : Script = {
          id = existingScript.id;
          title = title;
          description = description;
          category = category;
          content = content;
          author = existingScript.author;
          createdAt = existingScript.createdAt;
          updatedAt = Time.now();
        };

        scripts.add(id, updatedScript);
      };
    };
  };

  public shared ({ caller }) func deleteScript(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete scripts");
    };

    switch (scripts.get(id)) {
      case (null) { Runtime.trap("Script not found") };
      case (?existingScript) {
        if (existingScript.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own scripts");
        };

        // Move to deleted scripts for potential restore
        deletedScripts.add(id, existingScript);
        scripts.remove(id);
      };
    };
  };

  // Restore a deleted script (requires user authentication and ownership)
  public shared ({ caller }) func restoreScript(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can restore scripts");
    };

    switch (deletedScripts.get(id)) {
      case (null) { Runtime.trap("Deleted script not found") };
      case (?deletedScript) {
        if (deletedScript.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only restore your own scripts");
        };

        // Restore the script with original metadata
        scripts.add(id, deletedScript);
        deletedScripts.remove(id);
      };
    };
  };

  // Permanently delete a script from trash (requires user authentication and ownership)
  public shared ({ caller }) func permanentlyDeleteScript(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can permanently delete scripts");
    };

    switch (deletedScripts.get(id)) {
      case (null) { Runtime.trap("Deleted script not found") };
      case (?deletedScript) {
        if (deletedScript.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only permanently delete your own scripts");
        };

        deletedScripts.remove(id);
      };
    };
  };
};
