package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SubTopic.
 */
@Entity
@Table(name = "sub_topic")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SubTopic implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "subTopic")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "answers", "companies", "tags", "questionLikes", "users", "subTopic" }, allowSetters = true)
    private Set<Questions> questions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "subTopics" }, allowSetters = true)
    private Topic topic;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SubTopic id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public SubTopic name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Questions> getQuestions() {
        return this.questions;
    }

    public SubTopic questions(Set<Questions> questions) {
        this.setQuestions(questions);
        return this;
    }

    public SubTopic addQuestions(Questions questions) {
        this.questions.add(questions);
        questions.setSubTopic(this);
        return this;
    }

    public SubTopic removeQuestions(Questions questions) {
        this.questions.remove(questions);
        questions.setSubTopic(null);
        return this;
    }

    public void setQuestions(Set<Questions> questions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setSubTopic(null));
        }
        if (questions != null) {
            questions.forEach(i -> i.setSubTopic(this));
        }
        this.questions = questions;
    }

    public Topic getTopic() {
        return this.topic;
    }

    public SubTopic topic(Topic topic) {
        this.setTopic(topic);
        return this;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SubTopic)) {
            return false;
        }
        return id != null && id.equals(((SubTopic) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SubTopic{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
