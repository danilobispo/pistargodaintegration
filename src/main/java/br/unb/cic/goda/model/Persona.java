package br.unb.cic.goda.model;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.*;

public class Persona {
    protected String name;
    protected String description;
    protected ArrayList<String> contexts;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<String> getContexts() {
        return contexts;
    }

    public void setContexts(ArrayList<String> contexts) {
        this.contexts = contexts;
    }

    public Persona(String personaJSON) {
        JsonObject jsonObject = new JsonParser().parse(personaJSON).getAsJsonObject();
//        DEBUG
//        System.out.println(jsonObject);
        this.name = jsonObject.get("personaName").getAsString();
        this.description = jsonObject.get("personaDescription").getAsString();
        JsonArray contextArray = jsonObject.get("personaContexts").getAsJsonArray();
//        DEBUG
        System.out.println("Persona name: " + this.name);
        System.out.println("Persona description: " + this.description);
        int i;
        this.contexts = new ArrayList<String>();
        for(i = 0; i < contextArray.size(); i++){
            JsonObject context = contextArray.get(i).getAsJsonObject();
            String contextName = context.get("contextName").getAsString();
            if(contextName != null){
                this.contexts.add(contextName);
            }
        }
//        DEBUG
        System.out.println("Persona contexts: " + this.contexts);
    }

    public Persona(String name, String description, ArrayList<String> contexts) {
        this.name = name;
        this.description = description;
        this.contexts = contexts;
    }
}
